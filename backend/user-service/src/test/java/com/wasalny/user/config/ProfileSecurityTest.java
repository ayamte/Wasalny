package com.wasalny.user.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.wasalny.user.controller.AdminController;
import com.wasalny.user.controller.ClientController;
import com.wasalny.user.controller.ConducteurController;
import com.wasalny.user.controller.UserController;
import com.wasalny.user.entity.ClientProfile;
import com.wasalny.user.service.PasswordService;
import com.wasalny.user.service.UserProfileService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AdminController.class, ClientController.class,
        ConducteurController.class, UserController.class}, properties = {
        "spring.config.name=application-security-test",
        "spring.cloud.config.enabled=false", "spring.cloud.config.import-check.enabled=false"
})
@Import({SecurityConfiguration.class, ProfileAccess.class})
class ProfileSecurityTest {
    private static final byte[] JWT_KEY = new byte[32];
    private static final String INTERNAL_KEY;
    private static final String EMAIL = "owner@example.test";

    static {
        SecureRandom random = new SecureRandom();
        random.nextBytes(JWT_KEY);
        byte[] internal = new byte[32];
        random.nextBytes(internal);
        INTERNAL_KEY = Base64.getEncoder().encodeToString(internal);
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("security.jwt.secret-key", () -> Base64.getEncoder().encodeToString(JWT_KEY));
        registry.add("internal.api-key", () -> INTERNAL_KEY);
    }

    @Autowired MockMvc mvc;
    @MockitoBean UserProfileService profiles;
    @MockitoBean PasswordService passwords;
    @MockitoBean RestTemplate restTemplate;

    @Test
    void anonymousRequestsCannotReadProfilesOrAdministration() throws Exception {
        mvc.perform(get("/users/admin/users")).andExpect(status().isUnauthorized());
        mvc.perform(get("/users/client/profile").param("email", EMAIL))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(profiles);
    }

    @Test
    void administrationRequiresAnAdministratorJwt() throws Exception {
        when(profiles.getAllUsers()).thenReturn(List.of());
        mvc.perform(get("/users/admin/users").header("Authorization", token("CLIENT")))
                .andExpect(status().isForbidden());
        verifyNoInteractions(profiles);
        mvc.perform(get("/users/admin/users").header("Authorization", token("ADMIN")))
                .andExpect(status().isOk());
        verify(profiles).getAllUsers();
    }

    @Test
    void internalKeyOnlyAllowsTheProfileCreationEndpoint() throws Exception {
        mvc.perform(post("/users/admin/users/create").servletPath("/users/admin/users/create")
                        .header("X-Internal-Token", "invalid"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/users/admin/users/create").servletPath("/users/admin/users/create")
                        .header("Authorization", token("ADMIN")))
                .andExpect(status().isForbidden());
        mvc.perform(get("/users/admin/users").header("X-Internal-Token", INTERNAL_KEY))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(profiles);

        mvc.perform(post("/users/admin/users/create").servletPath("/users/admin/users/create")
                        .header("X-Internal-Token", INTERNAL_KEY)
                        .param("uuid", UUID.randomUUID().toString()).param("email", EMAIL)
                        .param("username", "owner").param("role", "CLIENT")
                        .param("dateCreation", "2026-01-01T12:00:00"))
                .andExpect(status().isOk());
        verify(profiles).createProfile(any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void expiredOrIncorrectlySignedTokensAreRejected() throws Exception {
        mvc.perform(get("/users/admin/users").header("Authorization",
                        token("ADMIN", JWT_KEY, Instant.now().minusSeconds(120))))
                .andExpect(status().isUnauthorized());
        byte[] otherKey = new byte[32];
        new SecureRandom().nextBytes(otherKey);
        mvc.perform(get("/users/admin/users").header("Authorization",
                        token("ADMIN", otherKey, Instant.now().plusSeconds(60))))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(profiles);
    }

    @Test
    void clientCanOnlyReadOrUpdateTheirOwnUuidProfile() throws Exception {
        UUID ownId = UUID.randomUUID();
        UUID otherId = UUID.randomUUID();
        ClientProfile own = new ClientProfile();
        own.setEmail(EMAIL);
        ClientProfile other = new ClientProfile();
        other.setEmail("other@example.test");
        when(profiles.getUserByUuid(ownId)).thenReturn(own);
        when(profiles.getUserByUuid(otherId)).thenReturn(other);
        when(profiles.updateUserByUuid(eq(ownId), any())).thenReturn(own);

        mvc.perform(get("/users/{id}", ownId).header("Authorization", token("CLIENT")))
                .andExpect(status().isOk());
        mvc.perform(put("/users/{id}", ownId).header("Authorization", token("CLIENT"))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nom\":\"Updated\"}"))
                .andExpect(status().isOk());
        mvc.perform(get("/users/{id}", otherId).header("Authorization", token("CLIENT")))
                .andExpect(status().isForbidden());
        mvc.perform(put("/users/{id}", otherId).header("Authorization", token("CLIENT"))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nom\":\"Updated\"}"))
                .andExpect(status().isForbidden());
        verify(profiles, never()).updateUserByUuid(eq(otherId), any());
    }

    @Test
    void emailProfileRoutesRejectAccessToAnotherPerson() throws Exception {
        mvc.perform(get("/users/client/profile").param("email", EMAIL)
                        .header("Authorization", token("CLIENT"))).andExpect(status().isOk());
        for (String path : List.of("/users/client/profile", "/users/conducteur/profile")) {
            mvc.perform(get(path).param("email", "other@example.test")
                            .header("Authorization", token("CLIENT")))
                    .andExpect(status().isForbidden());
            mvc.perform(put(path).param("email", "other@example.test")
                            .header("Authorization", token("CLIENT"))
                            .contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isForbidden());
        }
        verify(profiles).getClientProfile(EMAIL);
        verifyNoMoreInteractions(profiles);
    }

    @Test
    void clientCannotDeleteAnotherPersonsAccount() throws Exception {
        mvc.perform(delete("/users/client/account").param("email", "other@example.test")
                        .header("Authorization", token("CLIENT")))
                .andExpect(status().isForbidden());
        verifyNoInteractions(profiles);
        mvc.perform(delete("/users/client/account").param("email", EMAIL)
                        .header("Authorization", token("CLIENT")))
                .andExpect(status().isNoContent());
        verify(profiles).deleteClientAccount(EMAIL);
    }

    @Test
    void clientCannotRequestAPasswordChangeForAnotherPerson() throws Exception {
        mvc.perform(put("/users/client/password").header("Authorization", token("CLIENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"other@example.test\"}"))
                .andExpect(status().isForbidden());
        verifyNoInteractions(passwords);
    }

    private String token(String role) {
        return token(role, JWT_KEY, Instant.now().plusSeconds(60));
    }

    private String token(String role, byte[] key, Instant expiration) {
        JwtEncoder encoder = new NimbusJwtEncoder(new ImmutableSecret<>(new SecretKeySpec(key, "HmacSHA256")));
        JwtClaimsSet claims = JwtClaimsSet.builder().subject(EMAIL).claim("role", role)
                .issuedAt(expiration.minusSeconds(60)).expiresAt(expiration).build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return "Bearer " + encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
