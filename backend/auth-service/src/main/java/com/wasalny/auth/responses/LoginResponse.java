package com.wasalny.auth.responses;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private long expiresIn;
    private UUID userId;
    private String email;
    private String username;
    private String role;

    public LoginResponse(String token, long expiresIn, UUID userId, String email, String username, String role) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.role = role;
    }
}