package com.wasalny.user.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {
    @Bean
    JwtDecoder jwtDecoder(@Value("${security.jwt.secret-key}") String secret) {
        byte[] decoded = Base64.getDecoder().decode(secret);
        if (decoded.length < 32) throw new IllegalArgumentException("JWT key must contain at least 32 random bytes");
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(decoded, "HmacSHA256"))
                .macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,
            @Value("${internal.api-key}") String internalKey) throws Exception {
        if (internalKey.length() < 32) throw new IllegalArgumentException("Internal API key is too short");
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("role");
        authorities.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);

        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/admin/users/create").hasRole("SYSTEM")
                        .requestMatchers("/users/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(converter)))
                .addFilterBefore(new OncePerRequestFilter() {
                    @Override
                    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                            FilterChain chain) throws ServletException, IOException {
                        String supplied = request.getHeader("X-Internal-Token");
                        if ("POST".equals(request.getMethod())
                                && "/users/admin/users/create".equals(request.getServletPath())
                                && supplied != null && MessageDigest.isEqual(
                                    internalKey.getBytes(StandardCharsets.UTF_8),
                                    supplied.getBytes(StandardCharsets.UTF_8))) {
                            SecurityContextHolder.getContext().setAuthentication(
                                    new UsernamePasswordAuthenticationToken("auth-service", null,
                                            List.of(new SimpleGrantedAuthority("ROLE_SYSTEM"))));
                        }
                        chain.doFilter(request, response);
                    }
                }, BearerTokenAuthenticationFilter.class);
        return http.build();
    }
}
