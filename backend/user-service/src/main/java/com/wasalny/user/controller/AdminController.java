package com.wasalny.user.controller;

import com.wasalny.user.dto.UserInfoDto;
import com.wasalny.user.entity.*;
import com.wasalny.user.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final UserProfileService userProfileService;

    public AdminController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    // Consulter tous les utilisateurs
    @GetMapping("/users")
    public ResponseEntity<List<UserInfoDto>> getAllUsers() {
        List<UserInfoDto> users = userProfileService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Consulter les utilisateurs par rôle
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<UserInfoDto>> getUsersByRole(@PathVariable String role) {
        RoleUtilisateur roleEnum = RoleUtilisateur.valueOf(role.toUpperCase());
        List<UserInfoDto> users = userProfileService.getUsersByRole(roleEnum);
        return ResponseEntity.ok(users);
    }

    // Modifier le statut d'un client
    @PutMapping("/client/{email}/status")
    public ResponseEntity<ClientProfile> updateClientStatus(
            @PathVariable String email,
            @RequestParam StatutClient statut
    ) {
        ClientProfile updated = userProfileService.updateClientStatus(email, statut);
        return ResponseEntity.ok(updated);
    }

    // Modifier le statut d'un conducteur
    @PutMapping("/conducteur/{email}/status")
    public ResponseEntity<ConducteurProfile> updateConducteurStatus(
            @PathVariable String email,
            @RequestParam StatutConducteur statut
    ) {
        ConducteurProfile updated = userProfileService.updateConducteurStatus(email, statut);
        return ResponseEntity.ok(updated);
    }

    // Supprimer un utilisateur
    @DeleteMapping("/users/{email}")
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        userProfileService.deleteUser(email);
        return ResponseEntity.noContent().build();
    }

    // Endpoint de création de profil (appelé par auth-service)
    @PostMapping("/users/create")
    public ResponseEntity<UserProfile> createProfile(
            @RequestParam String email,
            @RequestParam String username,
            @RequestParam String role,
            @RequestParam String dateCreation
    ) {
        RoleUtilisateur roleEnum = RoleUtilisateur.valueOf(role.toUpperCase());
        LocalDateTime date = LocalDateTime.parse(dateCreation);
        UserProfile profile = userProfileService.createProfile(email, username, roleEnum, date);
        return ResponseEntity.ok(profile);
    }
}
