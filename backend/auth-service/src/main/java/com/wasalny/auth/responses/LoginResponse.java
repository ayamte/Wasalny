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
    private String prenom;
    private String nom;
    private String telephone;

    public LoginResponse(String token, long expiresIn, UUID userId, String email, String username, String role, String prenom, String nom, String telephone) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.role = role;
        this.prenom = prenom;
        this.nom = nom;
        this.telephone = telephone;
    }
}