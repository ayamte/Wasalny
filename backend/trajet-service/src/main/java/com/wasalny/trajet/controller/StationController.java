package com.wasalny.trajet.controller;

import com.wasalny.trajet.dto.request.StationCreateDTO;
import com.wasalny.trajet.dto.response.StationResponseDTO;
import com.wasalny.trajet.service.StationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;  
  
@RestController  
@RequestMapping("/trajets/stations")  
@RequiredArgsConstructor  
public class StationController {  
      
    private final StationService stationService;  
      
    /**
     * POST /stations - Créer une nouvelle station
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<StationResponseDTO> creerStation(@Valid @RequestBody StationCreateDTO dto) {  
        StationResponseDTO station = stationService.creerStation(dto);  
        return ResponseEntity.status(HttpStatus.CREATED).body(station);  
    }  
      
    /**
     * GET /stations - Obtenir toutes les stations actives
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping
    public ResponseEntity<List<StationResponseDTO>> listerStationsActives() {  
        List<StationResponseDTO> stations = stationService.obtenirStationsActives();  
        return ResponseEntity.ok(stations);  
    }  
      
    /**
     * GET /stations/{id} - Obtenir une station par ID
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<StationResponseDTO> obtenirStation(@PathVariable UUID id) {  
        StationResponseDTO station = stationService.obtenirStationParId(id);  
        return ResponseEntity.ok(station);  
    }  
      
    /**
     * GET /stations/nom/{nom} - Obtenir une station par nom
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/nom/{nom}")
    public ResponseEntity<StationResponseDTO> obtenirStationParNom(@PathVariable String nom) {  
        StationResponseDTO station = stationService.obtenirStationParNom(nom);  
        return ResponseEntity.ok(station);  
    }  
      
    /**
     * PUT /stations/{id}/desactiver - Désactiver une station
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactiver")
    public ResponseEntity<Void> desactiverStation(@PathVariable UUID id) {  
        stationService.desactiverStation(id);  
        return ResponseEntity.noContent().build();  
    }  
      
    /**
     * PUT /stations/{id}/activer - Activer une station
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activer")
    public ResponseEntity<Void> activerStation(@PathVariable UUID id) {  
        stationService.activerStation(id);  
        return ResponseEntity.noContent().build();  
    }  
}