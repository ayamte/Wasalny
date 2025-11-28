package com.wasalny.abonnement.config;  
  
import lombok.RequiredArgsConstructor;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.http.HttpMethod;  
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;  
import org.springframework.security.config.annotation.web.builders.HttpSecurity;  
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;  
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;  
import org.springframework.security.config.http.SessionCreationPolicy;  
import org.springframework.security.web.SecurityFilterChain;  
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;  
  
@Configuration  
@EnableWebSecurity  
@EnableMethodSecurity  
@RequiredArgsConstructor  
public class SecurityConfiguration {  
    private final JwtAuthenticationFilter jwtAuthenticationFilter;  
  
    @Bean  
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {  
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)  // CORS géré par API Gateway
                .authorizeHttpRequests(auth -> auth  
                        .requestMatchers("/actuator/**").permitAll()  
                        // Autoriser uniquement la lecture des types d'abonnement  
                        .requestMatchers(HttpMethod.GET, "/abonnements/types").permitAll()  
                        .requestMatchers(HttpMethod.GET, "/abonnements/types/actifs").permitAll()  
                        .requestMatchers(HttpMethod.GET, "/abonnements/types/*").permitAll()  
                        // La création reste protégée par @PreAuthorize("hasRole('ADMIN')")  
                        .requestMatchers("/abonnements/client/*/peut-utiliser-ligne/*").permitAll()  
                        .anyRequest().authenticated()  
                )  
                .sessionManagement(session -> session  
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  
                )  
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);  
  
        return http.build();  
    }  
}