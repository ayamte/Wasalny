package com.wasalny.user.controller;

import com.wasalny.user.dto.UpdateProfileDto;
import com.wasalny.user.entity.ConducteurProfile;
import com.wasalny.user.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/conducteur")
public class ConducteurController {
    private final UserProfileService userProfileService;

    public ConducteurController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    // Consulter son profil
    @GetMapping("/profile")
    public ResponseEntity<ConducteurProfile> getProfile(@RequestParam String email) {
        ConducteurProfile profile = userProfileService.getConducteurProfile(email);
        return ResponseEntity.ok(profile);
    }

    // Modifier son profil
    @PutMapping("/profile")
    public ResponseEntity<ConducteurProfile> updateProfile(
            @RequestParam String email,
            @RequestBody UpdateProfileDto dto
    ) {
        ConducteurProfile updated = userProfileService.updateConducteurProfile(email, dto);
        return ResponseEntity.ok(updated);
    }
}
