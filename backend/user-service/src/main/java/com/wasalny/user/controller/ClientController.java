package com.wasalny.user.controller;

import com.wasalny.user.dto.ChangePasswordDto;
import com.wasalny.user.dto.UpdateProfileDto;
import com.wasalny.user.entity.ClientProfile;
import com.wasalny.user.service.PasswordService;
import com.wasalny.user.service.UserProfileService;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
public class ClientController {
    private final UserProfileService userProfileService;
    private final PasswordService passwordService;

    public ClientController(UserProfileService userProfileService, @Lazy PasswordService passwordService) {
        this.userProfileService = userProfileService;
        this.passwordService = passwordService;
    }

    // Consulter son profil
    @GetMapping("/profile")
    public ResponseEntity<ClientProfile> getProfile(@RequestParam String email) {
        ClientProfile profile = userProfileService.getClientProfile(email);
        return ResponseEntity.ok(profile);
    }

    // Modifier son profil
    @PutMapping("/profile")
    public ResponseEntity<ClientProfile> updateProfile(
            @RequestParam String email,
            @RequestBody UpdateProfileDto dto
    ) {
        ClientProfile updated = userProfileService.updateClientProfile(email, dto);
        return ResponseEntity.ok(updated);
    }

    // Modifier son mot de passe
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordDto dto) {
        passwordService.changePassword(
            dto.getEmail(),
            dto.getCurrentPassword(),
            dto.getNewPassword(),
            dto.getVerificationCode()
        );
        return ResponseEntity.ok().build();
    }

    // Supprimer son compte
    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(@RequestParam String email) {
        userProfileService.deleteClientAccount(email);
        return ResponseEntity.noContent().build();
    }
}
