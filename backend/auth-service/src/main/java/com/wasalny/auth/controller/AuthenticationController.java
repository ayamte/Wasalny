package com.wasalny.auth.controller;

import com.wasalny.auth.dto.LoginUserDto;
import com.wasalny.auth.dto.RegisterUserDto;
import com.wasalny.auth.dto.VerifyUserDto;
import com.wasalny.auth.entity.User;
import com.wasalny.auth.responses.LoginResponse;
import com.wasalny.auth.responses.SignupResponse;
import com.wasalny.auth.service.AuthenticationService;
import com.wasalny.auth.service.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final RestTemplate restTemplate;

    @Value("${user.service.url:http://user-service:8083}")
    private String userServiceUrl;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, RestTemplate restTemplate) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);
        SignupResponse response = new SignupResponse(
                "Inscription réussie. Veuillez vérifier votre email pour activer votre compte.",
                registeredUser.getEmail()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto){
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Try to get user profile data from user-service
        String prenom = null;
        String nom = null;
        String telephone = null;

        try {
            // Call user-service directly via RestTemplate
            String url = userServiceUrl + "/api/users/" + authenticatedUser.getUuid().toString();
            System.out.println("Fetching user profile from: " + url);

            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> profileData = restTemplate.getForObject(url, java.util.Map.class);

            if (profileData != null) {
                prenom = (String) profileData.get("prenom");
                nom = (String) profileData.get("nom");
                telephone = (String) profileData.get("telephone");
                System.out.println("Successfully fetched profile data: prenom=" + prenom + ", nom=" + nom + ", telephone=" + telephone);
            }
        } catch (Exception e) {
            // Log error but continue with login - profile data is optional
            System.err.println("Could not fetch user profile: " + e.getMessage());
            e.printStackTrace();
        }

        LoginResponse loginResponse = new LoginResponse(
                jwtToken,
                jwtService.getExpirationTime(),
                authenticatedUser.getUuid(),
                authenticatedUser.getEmail(),
                authenticatedUser.getUsername(),
                authenticatedUser.getRole().name(),
                prenom,
                nom,
                telephone
        );
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}