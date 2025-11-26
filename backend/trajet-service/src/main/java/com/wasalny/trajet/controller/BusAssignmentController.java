package com.wasalny.trajet.controller;

import com.wasalny.trajet.dto.request.BusAssignmentCreateDTO;
import com.wasalny.trajet.dto.response.BusAssignmentResponseDTO;
import com.wasalny.trajet.service.BusAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/trajets/bus-assignments")
@RequiredArgsConstructor
public class BusAssignmentController {

    private final BusAssignmentService busAssignmentService;

    /**
     * POST /bus-assignments - Assigner un bus à une ligne et station de départ
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<BusAssignmentResponseDTO> assignerBus(@Valid @RequestBody BusAssignmentCreateDTO dto) {
        BusAssignmentResponseDTO assignment = busAssignmentService.assignerBus(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    /**
     * GET /bus-assignments/ligne/{ligneId} - Obtenir les assignations pour une ligne
     * Accessible par ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'CONDUCTEUR')")
    @GetMapping("/ligne/{ligneId}")
    public ResponseEntity<List<BusAssignmentResponseDTO>> obtenirAssignmentsParLigne(@PathVariable UUID ligneId) {
        List<BusAssignmentResponseDTO> assignments = busAssignmentService.obtenirAssignmentsParLigne(ligneId);
        return ResponseEntity.ok(assignments);
    }

    /**
     * PUT /bus-assignments/{id} - Modifier une assignation existante
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BusAssignmentResponseDTO> modifierAssignment(
            @PathVariable UUID id,
            @Valid @RequestBody BusAssignmentCreateDTO dto) {
        BusAssignmentResponseDTO assignment = busAssignmentService.modifierAssignment(id, dto);
        return ResponseEntity.ok(assignment);
    }

    /**
     * DELETE /bus-assignments/{id} - Supprimer une assignation
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAssignment(@PathVariable UUID id) {
        busAssignmentService.supprimerAssignment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /bus-assignments/{id}/desactiver - Désactiver une assignation
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactiver")
    public ResponseEntity<Void> desactiverAssignment(@PathVariable UUID id) {
        busAssignmentService.desactiverAssignment(id);
        return ResponseEntity.noContent().build();
    }
}