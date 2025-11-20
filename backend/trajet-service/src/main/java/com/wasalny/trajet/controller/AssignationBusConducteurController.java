package com.wasalny.trajet.controller;

import com.wasalny.trajet.dto.request.AssignationBusConducteurCreateDTO;
import com.wasalny.trajet.dto.response.AssignationBusConducteurResponseDTO;
import com.wasalny.trajet.service.AssignationBusConducteurService;
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
  
@RestController  
@RequestMapping("/trajets/assignations")  
@RequiredArgsConstructor  
public class AssignationBusConducteurController {  
      
    private final AssignationBusConducteurService assignationService;  
      
    /**
     * POST /assignations - Créer une assignation
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<AssignationBusConducteurResponseDTO> creerAssignation(
            @Valid @RequestBody AssignationBusConducteurCreateDTO dto) {  
        AssignationBusConducteurResponseDTO assignation = assignationService.creerAssignation(dto);  
        return ResponseEntity.status(HttpStatus.CREATED).body(assignation);  
    }  
      
    /**
     * GET /assignations/bus/{busId}/active - Assignation active d'un bus
     * Accessible par ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'CONDUCTEUR')")
    @GetMapping("/bus/{busId}/active")
    public ResponseEntity<AssignationBusConducteurResponseDTO> obtenirAssignationActive(
            @PathVariable UUID busId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
        AssignationBusConducteurResponseDTO assignation = assignationService.obtenirAssignationActive(busId, date);  
        return ResponseEntity.ok(assignation);  
    }  
      
    /**
     * GET /assignations/bus/{busId} - Toutes les assignations d'un bus
     * Accessible par ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'CONDUCTEUR')")
    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<AssignationBusConducteurResponseDTO>> obtenirAssignationsDuBus(@PathVariable UUID busId) {  
        List<AssignationBusConducteurResponseDTO> assignations = assignationService.obtenirAssignationsDuBus(busId);  
        return ResponseEntity.ok(assignations);  
    }  
      
    /**
     * GET /assignations/conducteur/{conducteurId} - Assignations d'un conducteur
     * Accessible par ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'CONDUCTEUR')")
    @GetMapping("/conducteur/{conducteurId}")
    public ResponseEntity<List<AssignationBusConducteurResponseDTO>> obtenirAssignationsDuConducteur(
            @PathVariable UUID conducteurId) {  
        List<AssignationBusConducteurResponseDTO> assignations = assignationService.obtenirAssignationsDuConducteur(conducteurId);  
        return ResponseEntity.ok(assignations);  
    }  
      
    /**
     * PUT /assignations/{id}/desactiver - Désactiver une assignation
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactiver")
    public ResponseEntity<Void> desactiverAssignation(@PathVariable UUID id) {  
        assignationService.desactiverAssignation(id);  
        return ResponseEntity.noContent().build();  
    }  
      
    /**
     * PUT /assignations/{id}/activer - Activer une assignation
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activer")
    public ResponseEntity<Void> activerAssignation(@PathVariable UUID id) {  
        assignationService.activerAssignation(id);  
        return ResponseEntity.noContent().build();  
    }  
}