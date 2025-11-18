package com.wasalny.trajet.controller;  
  
import com.wasalny.trajet.dto.request.LigneCreateDTO;  
import com.wasalny.trajet.dto.response.LigneResponseDTO;  
import com.wasalny.trajet.dto.simple.StationSimpleDTO;  
import com.wasalny.trajet.service.LigneService;  
import jakarta.validation.Valid;  
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;  
  
@RestController  
@RequestMapping("/trajets/lignes")  
@RequiredArgsConstructor  
public class LigneController {  
      
    private final LigneService ligneService;  
      
    /**
     * POST /lignes - Créer une nouvelle ligne avec stations intermédiaires
     * Accessible par ADMIN seulement
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LigneResponseDTO> creerLigne(@Valid @RequestBody LigneCreateDTO dto) {
        LigneResponseDTO ligne = ligneService.creerLigne(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ligne);
    }

    /**
     * GET /lignes/{id} - Obtenir une ligne par son ID
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    public ResponseEntity<LigneResponseDTO> obtenirLigne(@PathVariable UUID id) {
        LigneResponseDTO ligne = ligneService.obtenirLigneParId(id);
        return ResponseEntity.ok(ligne);
    }

    /**
     * GET /lignes - Lister toutes les lignes
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    public ResponseEntity<List<LigneResponseDTO>> listerLignes() {
        List<LigneResponseDTO> lignes = ligneService.listerToutesLesLignes();
        return ResponseEntity.ok(lignes);
    }

    /**
     * GET /lignes/{id}/stations - Obtenir les stations d'une ligne
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @GetMapping("/{id}/stations")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    public ResponseEntity<List<StationSimpleDTO>> obtenirStationsDeLigne(@PathVariable UUID id) {
        List<StationSimpleDTO> stations = ligneService.obtenirStationsDeLigne(id);
        return ResponseEntity.ok(stations);
    }

    /**
     * PUT /lignes/{id}/desactiver - Désactiver une ligne
     * Accessible par ADMIN seulement
     */
    @PutMapping("/{id}/desactiver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactiverLigne(@PathVariable UUID id) {
        ligneService.desactiverLigne(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /lignes/{id}/activer - Activer une ligne
     * Accessible par ADMIN seulement
     */
    @PutMapping("/{id}/activer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activerLigne(@PathVariable UUID id) {
        ligneService.activerLigne(id);
        return ResponseEntity.noContent().build();
    }  
}