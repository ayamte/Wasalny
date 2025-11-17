package com.wasalny.user.service;

import com.wasalny.user.dto.UpdateProfileDto;
import com.wasalny.user.dto.UserInfoDto;
import com.wasalny.user.entity.*;
import com.wasalny.user.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final ConducteurProfileRepository conducteurProfileRepository;
    private final AdminProfileRepository adminProfileRepository;

    public UserProfileService(
        UserProfileRepository userProfileRepository,
        ClientProfileRepository clientProfileRepository,
        ConducteurProfileRepository conducteurProfileRepository,
        AdminProfileRepository adminProfileRepository
    ) {
        this.userProfileRepository = userProfileRepository;
        this.clientProfileRepository = clientProfileRepository;
        this.conducteurProfileRepository = conducteurProfileRepository;
        this.adminProfileRepository = adminProfileRepository;
    }

    // Création de profil (appelé par auth-service)
    @Transactional
    public UserProfile createProfile(String email, String username, RoleUtilisateur role, LocalDateTime dateCreation) {
        if (userProfileRepository.existsByEmail(email)) {
            throw new RuntimeException("Profile already exists for email: " + email);
        }

        UserProfile profile;
        switch (role) {
            case CLIENT:
                profile = new ClientProfile();
                break;
            case CONDUCTEUR:
                profile = new ConducteurProfile();
                break;
            case ADMIN:
                profile = new AdminProfile();
                break;
            default:
                throw new RuntimeException("Invalid role: " + role);
        }

        profile.setEmail(email);
        profile.setUsername(username);
        profile.setRole(role);
        profile.setDateCreation(dateCreation);

        return userProfileRepository.save(profile);
    }

    // ADMIN : Consulter tous les utilisateurs par rôle
    public List<UserInfoDto> getUsersByRole(RoleUtilisateur role) {
        List<UserProfile> profiles = userProfileRepository.findByRole(role);
        List<UserInfoDto> dtos = new ArrayList<>();

        for (UserProfile profile : profiles) {
            UserInfoDto dto = convertToDto(profile);
            dtos.add(dto);
        }

        return dtos;
    }

    // ADMIN : Consulter tous les utilisateurs
    public List<UserInfoDto> getAllUsers() {
        List<UserProfile> profiles = userProfileRepository.findAll();
        List<UserInfoDto> dtos = new ArrayList<>();

        for (UserProfile profile : profiles) {
            UserInfoDto dto = convertToDto(profile);
            dtos.add(dto);
        }

        return dtos;
    }

    // ADMIN : Modifier le statut d'un client
    @Transactional
    public ClientProfile updateClientStatus(String email, StatutClient statut) {
        ClientProfile client = clientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setStatut(statut);
        return clientProfileRepository.save(client);
    }

    // ADMIN : Modifier le statut d'un conducteur
    @Transactional
    public ConducteurProfile updateConducteurStatus(String email, StatutConducteur statut) {
        ConducteurProfile conducteur = conducteurProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conducteur not found"));
        conducteur.setStatut(statut);
        return conducteurProfileRepository.save(conducteur);
    }

    // ADMIN : Supprimer un utilisateur
    @Transactional
    public void deleteUser(String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userProfileRepository.delete(profile);
    }

    // CLIENT : Consulter son profil
    public ClientProfile getClientProfile(String email) {
        return clientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));
    }

    // CLIENT : Modifier son profil
    @Transactional
    public ClientProfile updateClientProfile(String email, UpdateProfileDto dto) {
        ClientProfile client = clientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        if (dto.getNom() != null) client.setNom(dto.getNom());
        if (dto.getPrenom() != null) client.setPrenom(dto.getPrenom());
        if (dto.getTelephone() != null) client.setTelephone(dto.getTelephone());

        return clientProfileRepository.save(client);
    }

    // CLIENT : Supprimer son compte
    @Transactional
    public void deleteClientAccount(String email) {
        ClientProfile client = clientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));
        clientProfileRepository.delete(client);
    }

    // CONDUCTEUR : Consulter son profil
    public ConducteurProfile getConducteurProfile(String email) {
        return conducteurProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conducteur profile not found"));
    }

    // CONDUCTEUR : Modifier son profil
    @Transactional
    public ConducteurProfile updateConducteurProfile(String email, UpdateProfileDto dto) {
        ConducteurProfile conducteur = conducteurProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conducteur profile not found"));

        if (dto.getNom() != null) conducteur.setNom(dto.getNom());
        if (dto.getPrenom() != null) conducteur.setPrenom(dto.getPrenom());
        if (dto.getTelephone() != null) conducteur.setTelephone(dto.getTelephone());

        return conducteurProfileRepository.save(conducteur);
    }

    // Méthode utilitaire pour convertir en DTO
    private UserInfoDto convertToDto(UserProfile profile) {
        UserInfoDto dto = new UserInfoDto();
        dto.setId(profile.getId());
        dto.setUuid(profile.getUuid());
        dto.setEmail(profile.getEmail());
        dto.setUsername(profile.getUsername());
        dto.setRole(profile.getRole());
        dto.setDateCreation(profile.getDateCreation());

        if (profile instanceof ClientProfile) {
            ClientProfile client = (ClientProfile) profile;
            dto.setNom(client.getNom());
            dto.setPrenom(client.getPrenom());
            dto.setTelephone(client.getTelephone());
            dto.setStatut(client.getStatut().name());
        } else if (profile instanceof ConducteurProfile) {
            ConducteurProfile conducteur = (ConducteurProfile) profile;
            dto.setNom(conducteur.getNom());
            dto.setPrenom(conducteur.getPrenom());
            dto.setTelephone(conducteur.getTelephone());
            dto.setStatut(conducteur.getStatut().name());
        }

        return dto;
    }
}
