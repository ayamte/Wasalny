package com.wasalny.trajet.controller;

import com.wasalny.trajet.dto.request.ConfigurationHoraireCreateDTO;
import com.wasalny.trajet.dto.response.ConfigurationHoraireResponseDTO;
import com.wasalny.trajet.dto.response.TripResponseDTO;
import com.wasalny.trajet.entity.Trip;
import com.wasalny.trajet.service.ConfigurationHoraireService;
import com.wasalny.trajet.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;  
  
@RestController  
@RequestMapping("/trajets/configurations-horaires")  
@RequiredArgsConstructor  
public class ConfigurationHoraireController {  
      
    private final ConfigurationHoraireService configService;  
    private final TripService tripService;  
      
    /**
     * POST /configurations-horaires - Créer une configuration d'horaire
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ConfigurationHoraireResponseDTO> creerConfiguration(
            @Valid @RequestBody ConfigurationHoraireCreateDTO dto) {  
        ConfigurationHoraireResponseDTO config = configService.creerConfiguration(dto);  
        return ResponseEntity.status(HttpStatus.CREATED).body(config);  
    }  
      
    /**
     * GET /configurations-horaires/{id} - Obtenir une configuration par ID
     * Accessible par ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'CONDUCTEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<ConfigurationHoraireResponseDTO> obtenirConfiguration(@PathVariable UUID id) {  
        ConfigurationHoraireResponseDTO config = configService.obtenirConfigurationParId(id);  
        return ResponseEntity.ok(config);  
    }  
      
    /**
     * POST /configurations-horaires/{configId}/generer-trips - Générer les trips d'une journée
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{configId}/generer-trips")
    public ResponseEntity<List<TripResponseDTO>> genererTripsJournee(
            @PathVariable UUID configId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
          
        // Générer les trips (retourne List<Trip>)  
        List<Trip> trips = configService.genererTripsJournee(configId, date);  
          
        // Convertir en DTOs  
        List<TripResponseDTO> tripDTOs = trips.stream()  
            .map(trip -> tripService.convertToResponseDTO(trip))  
            .collect(Collectors.toList());  
          
        return ResponseEntity.status(HttpStatus.CREATED).body(tripDTOs);  
    }  
      
    /**
     * GET /configurations-horaires/ligne/{ligneId} - Obtenir les configurations d'une ligne
     * Accessible par ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'CONDUCTEUR')")
    @GetMapping("/ligne/{ligneId}")
    public ResponseEntity<List<ConfigurationHoraireResponseDTO>> obtenirConfigurationsParLigne(
            @PathVariable UUID ligneId) {  
        List<ConfigurationHoraireResponseDTO> configs = configService.obtenirConfigurationsParLigne(ligneId);  
        return ResponseEntity.ok(configs);  
    }  
      
    /**
     * GET /configurations-horaires/actives - Obtenir toutes les configurations actives
     * Accessible par ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'CONDUCTEUR')")
    @GetMapping("/actives")
    public ResponseEntity<List<ConfigurationHoraireResponseDTO>> obtenirConfigurationsActives() {  
        List<ConfigurationHoraireResponseDTO> configs = configService.obtenirConfigurationsActives();  
        return ResponseEntity.ok(configs);  
    }  
      
    /**
     * PUT /configurations-horaires/{id} - Mettre à jour une configuration
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ConfigurationHoraireResponseDTO> mettreAJourConfiguration(
            @PathVariable UUID id,
            @Valid @RequestBody ConfigurationHoraireCreateDTO dto) {  
        ConfigurationHoraireResponseDTO config = configService.mettreAJourConfiguration(id, dto);  
        return ResponseEntity.ok(config);  
    }  
      
    /**
     * DELETE /configurations-horaires/{id} - Supprimer une configuration
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerConfiguration(@PathVariable UUID id) {  
        configService.supprimerConfiguration(id);  
        return ResponseEntity.noContent().build();  
    }  
      
    /**
     * POST /configurations-horaires/{id}/activer - Activer une configuration
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/activer")
    public ResponseEntity<Void> activerConfiguration(@PathVariable UUID id) {  
        configService.activerConfiguration(id);  
        return ResponseEntity.ok().build();  
    }  
      
    /**
     * POST /configurations-horaires/{id}/desactiver - Désactiver une configuration
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/desactiver")
    public ResponseEntity<Void> desactiverConfiguration(@PathVariable UUID id) {  
        configService.desactiverConfiguration(id);  
        return ResponseEntity.ok().build();  
    }  
}