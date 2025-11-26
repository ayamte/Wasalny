package com.wasalny.trajet.controller;

import com.wasalny.trajet.dto.request.ConfirmerPassageDTO;
import com.wasalny.trajet.dto.request.TripUpdateDTO;
import com.wasalny.trajet.dto.response.TripResponseDTO;
import com.wasalny.trajet.dto.search.TripSearchDTO;
import com.wasalny.trajet.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.wasalny.trajet.entity.StatutTrip;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.wasalny.trajet.dto.request.LocationUpdateDTO;
import com.wasalny.trajet.entity.Trip;
import com.wasalny.trajet.repository.TripRepository;
import com.wasalny.trajet.service.GeolocationClientService;
  
import java.time.LocalDate;  
import java.util.List;  
import java.util.UUID;  
  
@RestController  
@RequestMapping("/trajets/trips")  
@RequiredArgsConstructor  
public class TripController {  
      
    private final TripService tripService;  
    private final TripRepository tripRepository;  
    private final GeolocationClientService geolocationClientService;
      
    /**
     * POST /trips/{tripId}/demarrer - Démarrer un trip
     * Accessible uniquement par les CONDUCTEUR
     */
    @PreAuthorize("hasRole('CONDUCTEUR')")
    @PostMapping("/{tripId}/demarrer")
    public ResponseEntity<TripResponseDTO> demarrerTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.demarrerTrip(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**
     * POST /trips/{tripId}/terminer - Terminer un trip
     * Accessible uniquement par les CONDUCTEUR
     */
    @PreAuthorize("hasRole('CONDUCTEUR')")
    @PostMapping("/{tripId}/terminer")
    public ResponseEntity<TripResponseDTO> terminerTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.terminerTrip(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**
     * POST /trips/{tripId}/annuler - Annuler un trip
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{tripId}/annuler")
    public ResponseEntity<TripResponseDTO> annulerTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.annulerTrip(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**
     * POST /trips/{tripId}/confirmer-passage - Confirmer le passage à une station
     * Accessible uniquement par les CONDUCTEUR
     */
    @PreAuthorize("hasRole('CONDUCTEUR')")
    @PostMapping("/{tripId}/confirmer-passage")
    public ResponseEntity<TripResponseDTO> confirmerPassage(
            @PathVariable UUID tripId,
            @Valid @RequestBody ConfirmerPassageDTO dto) {  
        TripResponseDTO trip = tripService.confirmerPassageStation(tripId, dto);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**
     * POST /trips/{tripId}/reserver-place - Réserver une place dans un trip
     * Accessible par CLIENT, ADMIN
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    @PostMapping("/{tripId}/reserver-place")
    public ResponseEntity<TripResponseDTO> reserverPlace(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.reserverPlace(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**
     * GET /trips/{tripId} - Obtenir un trip par ID
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponseDTO> obtenirTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.obtenirTripParId(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**
     * GET /trips/numero/{numeroTrip} - Obtenir un trip par numéro
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/numero/{numeroTrip}")
    public ResponseEntity<TripResponseDTO> obtenirTripParNumero(@PathVariable String numeroTrip) {  
        TripResponseDTO trip = tripService.obtenirTripParNumero(numeroTrip);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**
     * GET /trips/date/{date} - Obtenir tous les trips d'une date
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/date/{date}")
    public ResponseEntity<List<TripResponseDTO>> obtenirTripsParDate(
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
    // Utiliser obtenirTripsParDateEtStatut au lieu de obtenirTripsParDate  
    List<TripResponseDTO> trips = tripService.obtenirTripsParDateEtStatut(date, StatutTrip.PLANIFIE);  
    return ResponseEntity.ok(trips);  
}   
      
    /**
     * GET /trips/ligne/{ligneId}/date/{date} - Obtenir les trips d'une ligne à une date
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/ligne/{ligneId}/date/{date}")
    public ResponseEntity<List<TripResponseDTO>> obtenirTripsParLigneEtDate(
            @PathVariable UUID ligneId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
        List<TripResponseDTO> trips = tripService.obtenirTripsParLigneEtDate(ligneId, date);  
        return ResponseEntity.ok(trips);  
    }  
      
    /**
     * GET /trips/bus/{busId}/date/{date} - Obtenir les trips d'un bus à une date
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/bus/{busId}/date/{date}")
    public ResponseEntity<List<TripResponseDTO>> obtenirTripsParBusEtDate(
            @PathVariable UUID busId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
        List<TripResponseDTO> trips = tripService.obtenirTripsParBusEtDate(busId, date);  
        return ResponseEntity.ok(trips);  
    }  
      
    /**
     * POST /trips/recherche - Rechercher des trips entre deux stations
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @PostMapping("/rechercher")
    public ResponseEntity<List<TripResponseDTO>> rechercherTrips(
        @Valid @RequestBody TripSearchDTO searchDTO) {  
    // Utiliser rechercherTrips au lieu de rechercherTripsEntreStations  
    List<TripResponseDTO> trips = tripService.rechercherTrips(searchDTO);  
    return ResponseEntity.ok(trips);  
}  
      
    /**
     * GET /trips/station/{stationId}/date/{date} - Obtenir les trips passant par une station
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/station/{stationId}/date/{date}")
    public ResponseEntity<List<TripResponseDTO>> obtenirTripsParStation(
        @PathVariable UUID stationId,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
    // Le nom est correct  
    List<TripResponseDTO> trips = tripService.obtenirTripsParStation(stationId, date);  
    return ResponseEntity.ok(trips);  
}
    /**
     * POST /trips/{tripId}/update-location - Mettre à jour la position du bus
     * Accessible uniquement par les CONDUCTEUR
     */
    @PreAuthorize("hasRole('CONDUCTEUR')")
    @PostMapping("/{tripId}/update-location")
    public ResponseEntity<Void> updateTripLocation(
        @PathVariable UUID tripId,
        @RequestBody LocationUpdateDTO dto) {  
      
    // Valider que le trip est EN_COURS  
    Trip trip = tripRepository.findById(tripId)  
        .orElseThrow(() -> new RuntimeException("Trip non trouvé"));  
      
    if (trip.getStatut() != StatutTrip.EN_COURS) {  
        throw new RuntimeException("Le trip n'est pas en cours");  
    }  
      
    // Appeler le geolocalisation-service  
    geolocationClientService.updateBusLocation(  
        trip.getBus().getId(),  
        dto.getLatitude(),  
        dto.getLongitude()  
    );  
      
    return ResponseEntity.ok().build();  
}
      
    /**
     * GET /trips/{tripId}/places-disponibles - Vérifier les places disponibles
     * Accessible par CLIENT, ADMIN, CONDUCTEUR
     */
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'CONDUCTEUR')")
    @GetMapping("/{tripId}/places-disponibles")
    public ResponseEntity<Integer> obtenirPlacesDisponibles(@PathVariable UUID tripId) {
        Integer places = tripService.obtenirPlacesDisponibles(tripId);
        return ResponseEntity.ok(places);
    }

    /**
     * DELETE /trips/{tripId} - Supprimer un trip
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> supprimerTrip(@PathVariable UUID tripId) {
        tripService.supprimerTrip(tripId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /trips - Obtenir tous les trips avec filtres optionnels
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<TripResponseDTO>> obtenirTousLesTrips(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) UUID ligneId,
            @RequestParam(required = false) StatutTrip statut) {
        System.out.println("=== GET /trips ===");
        System.out.println("dateDebut: " + dateDebut);
        System.out.println("dateFin: " + dateFin);
        System.out.println("ligneId: " + ligneId);
        System.out.println("statut: " + statut);

        List<TripResponseDTO> trips = tripService.obtenirTripsAvecFiltres(dateDebut, dateFin, ligneId, statut);
        System.out.println("Nombre de trips retournés: " + trips.size());
        return ResponseEntity.ok(trips);
    }

    /**
     * PUT /trips/{tripId} - Modifier un trip
     * Accessible uniquement par les ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{tripId}")
    public ResponseEntity<TripResponseDTO> modifierTrip(
            @PathVariable UUID tripId,
            @RequestBody @Valid TripUpdateDTO updateDTO) {
        TripResponseDTO tripModifie = tripService.modifierTrip(tripId, updateDTO);
        return ResponseEntity.ok(tripModifie);
    }

    /**
     * GET /trips/assigned - Obtenir le trip assigné au conducteur actuel
     * Accessible uniquement par les CONDUCTEUR
     */
    @PreAuthorize("hasRole('CONDUCTEUR')")
    @GetMapping("/assigned")
    public ResponseEntity<TripResponseDTO> obtenirTripAssigne() {
        TripResponseDTO trip = tripService.obtenirTripAssigne();
        return ResponseEntity.ok(trip);
    }

    /**
     * GET /trips/active - Obtenir le trip actif du conducteur actuel
     * Accessible uniquement par les CONDUCTEUR
     */
    @PreAuthorize("hasRole('CONDUCTEUR')")
    @GetMapping("/active")
    public ResponseEntity<TripResponseDTO> obtenirTripActif() {
        TripResponseDTO trip = tripService.obtenirTripActif();
        return ResponseEntity.ok(trip);
    }
}