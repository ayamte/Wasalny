package com.wasalny.user.controller;

import com.wasalny.user.dto.UpdateProfileDto;
import com.wasalny.user.dto.UserInfoDto;
import com.wasalny.user.entity.UserProfile;
import com.wasalny.user.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserProfileService userProfileService;

    public UserController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserByUuid(@PathVariable String userId) {
        try {
            UUID uuid = UUID.fromString(userId);
            UserProfile profile = userProfileService.getUserByUuid(uuid);
            UserInfoDto dto = userProfileService.convertProfileToDto(profile);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid UUID format");
        } catch (RuntimeException e) {
            // If profile not found, return a minimal user info response instead of error
            // This allows newly registered users to access their profile page
            try {
                UUID uuid = UUID.fromString(userId);
                UserInfoDto emptyProfile = new UserInfoDto();
                emptyProfile.setUuid(uuid);
                return ResponseEntity.ok(emptyProfile);
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody UpdateProfileDto updateDto) {
        try {
            UUID uuid = UUID.fromString(userId);
            UserProfile updatedProfile = userProfileService.updateUserByUuid(uuid, updateDto);
            UserInfoDto dto = userProfileService.convertProfileToDto(updatedProfile);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid UUID format");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
