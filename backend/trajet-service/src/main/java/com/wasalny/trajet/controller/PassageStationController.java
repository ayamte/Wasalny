package com.wasalny.trajet.controller;

import com.wasalny.trajet.dto.response.PassageStationResponseDTO;
import com.wasalny.trajet.service.PassageStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;  
  
@RestController  
@RequestMapping("/trajets/passages")  
@RequiredArgsConstructor  
public class PassageStationController {  
      
    private final PassageStationService passageStationService;  
      
    /**
     * POST /passages/{passageId}/confirmer - Confirmer un passage
     * Accessible uniquement par les CONDUCTEUR
     */
    @PreAuthorize("hasRole('CONDUCTEUR')")
    @PostMapping("/{passageId}/confirmer")
    public ResponseEntity<PassageStationResponseDTO> confirmerPassage(
            @PathVariable UUID passageId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime heureReelle) {  
        PassageStationResponseDTO passage = passageStationService.confirmerPassage(passageId, heureReelle);  
        return ResponseEntity.ok(passage);  
    }  
      
    /**
     * GET /passages/trip/{tripId} - Obtenir tous les passages d'un trip
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<PassageStationResponseDTO>> obtenirPassagesDuTrip(@PathVariable UUID tripId) {  
        List<PassageStationResponseDTO> passages = passageStationService.obtenirPassagesDuTrip(tripId);  
        return ResponseEntity.ok(passages);  
    }  
      
    /**
     * GET /passages/trip/{tripId}/non-confirmes - Passages non confirmés
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/trip/{tripId}/non-confirmes")
    public ResponseEntity<List<PassageStationResponseDTO>> obtenirPassagesNonConfirmes(@PathVariable UUID tripId) {  
        List<PassageStationResponseDTO> passages = passageStationService.obtenirPassagesNonConfirmes(tripId);  
        return ResponseEntity.ok(passages);  
    }  
      
    /**
     * GET /passages/{passageId}/heure-estimee - Heure estimée d'arrivée
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/{passageId}/heure-estimee")
    public ResponseEntity<LocalTime> obtenirHeureEstimee(@PathVariable UUID passageId) {  
        LocalTime heureEstimee = passageStationService.obtenirHeureEstimee(passageId);  
        return ResponseEntity.ok(heureEstimee);  
    }  
}