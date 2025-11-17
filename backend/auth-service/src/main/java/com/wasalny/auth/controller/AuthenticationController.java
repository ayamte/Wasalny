package com.wasalny.auth.controller;

import com.wasalny.auth.dto.LoginUserDto;
import com.wasalny.auth.dto.RegisterUserDto;
import com.wasalny.auth.dto.VerifyUserDto;
import com.wasalny.auth.entity.User;
import com.wasalny.auth.responses.LoginResponse;
import com.wasalny.auth.responses.SignupResponse;
import com.wasalny.auth.service.AuthenticationService;
import com.wasalny.auth.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
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
        LoginResponse loginResponse = new LoginResponse(
                jwtToken,
                jwtService.getExpirationTime(),
                authenticatedUser.getUuid(),
                authenticatedUser.getEmail(),
                authenticatedUser.getUsername(),
                authenticatedUser.getRole().name()
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