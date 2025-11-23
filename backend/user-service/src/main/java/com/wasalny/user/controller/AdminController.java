package com.wasalny.user.controller;

import com.wasalny.user.dto.CreateConducteurDto;
import com.wasalny.user.dto.UserInfoDto;
import com.wasalny.user.entity.*;
import com.wasalny.user.service.UserProfileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users/admin")
public class AdminController {
    private final UserProfileService userProfileService;
    private final RestTemplate restTemplate;

    @Value("${auth.service.url:http://localhost:8086}")
    private String authServiceUrl;

    public AdminController(UserProfileService userProfileService, RestTemplate restTemplate) {
        this.userProfileService = userProfileService;
        this.restTemplate = restTemplate;
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
            @RequestParam String uuid,
            @RequestParam String email,
            @RequestParam String username,
            @RequestParam String role,
            @RequestParam String dateCreation,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String telephone,
            @RequestParam(required = false) String numeroPermis
    ) {
        RoleUtilisateur roleEnum = RoleUtilisateur.valueOf(role.toUpperCase());
        LocalDateTime date = LocalDateTime.parse(dateCreation);
        UserProfile profile = userProfileService.createProfile(uuid, email, username, roleEnum, date, nom, prenom, telephone, numeroPermis);
        return ResponseEntity.ok(profile);
    }

    // Créer un conducteur (ADMIN only) - Appelle auth-service
    @PostMapping("/conducteur/create")
    public ResponseEntity<?> createConducteur(@RequestBody CreateConducteurDto dto) {
        try {
            // Validation des champs requis
            if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "L'email est obligatoire");
                return ResponseEntity.badRequest().body(error);
            }
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Le mot de passe est obligatoire");
                return ResponseEntity.badRequest().body(error);
            }
            if (dto.getUsername() == null || dto.getUsername().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Le nom d'utilisateur est obligatoire");
                return ResponseEntity.badRequest().body(error);
            }
            if (dto.getNumeroPermis() == null || dto.getNumeroPermis().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Le numéro de permis est obligatoire");
                return ResponseEntity.badRequest().body(error);
            }

            // Préparer la requête pour auth-service
            Map<String, String> signupRequest = new HashMap<>();
            signupRequest.put("username", dto.getUsername());
            signupRequest.put("email", dto.getEmail());
            signupRequest.put("password", dto.getPassword());
            signupRequest.put("role", "CONDUCTEUR");
            signupRequest.put("nom", dto.getNom());
            signupRequest.put("prenom", dto.getPrenom());
            signupRequest.put("telephone", dto.getTelephone());
            signupRequest.put("numeroPermis", dto.getNumeroPermis());

            // Appeler auth-service pour créer l'utilisateur
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(signupRequest, headers);

            String url = authServiceUrl + "/auth/signup";
            System.out.println("Calling auth-service at: " + url);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            // Retourner la réponse
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("message", "Conducteur créé avec succès");
            successResponse.put("email", dto.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);

        } catch (HttpClientErrorException e) {
            // Gérer les erreurs HTTP du auth-service
            System.err.println("Error from auth-service: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());

            Map<String, String> error = new HashMap<>();
            if (e.getStatusCode() == HttpStatus.CONFLICT) {
                error.put("error", "Cet email est déjà utilisé");
            } else {
                error.put("error", "Erreur lors de la création du conducteur: " + e.getMessage());
            }
            return ResponseEntity.status(e.getStatusCode()).body(error);
        } catch (Exception e) {
            // Gérer les autres erreurs
            System.err.println("Unexpected error creating conducteur: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur serveur lors de la création du conducteur");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
