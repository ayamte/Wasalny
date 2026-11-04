package com.wasalny.auth.service;

import com.wasalny.auth.entity.RoleUtilisateur;
import com.wasalny.auth.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.SecureRandom;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {
    @Test
    void tokenUsesTheEmailRequiredByAuthenticationAndProfileServices() {
        byte[] key = new byte[64];
        new SecureRandom().nextBytes(key);
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "secretKey", Base64.getEncoder().encodeToString(key));
        ReflectionTestUtils.setField(service, "jwtExpiration", 60000L);
        User user = new User("display-name", "login@example.test", "unused-test-hash");
        user.setRole(RoleUtilisateur.CLIENT);

        String token = service.generateToken(user);

        assertEquals(user.getEmail(), service.extractUsername(token));
        assertTrue(service.isTokenValid(token, user));
        assertFalse(service.isTokenValid(token, new User("other", "other@example.test", "unused")));
    }
}
