package com.wasalny.trajet.controller;  
  
import com.wasalny.trajet.dto.request.ConfirmerPassageDTO;  
import com.wasalny.trajet.dto.response.TripResponseDTO;  
import com.wasalny.trajet.dto.search.TripSearchDTO;  
import com.wasalny.trajet.service.TripService;  
import jakarta.validation.Valid;  
import lombok.RequiredArgsConstructor;  
import com.wasalny.trajet.entity.StatutTrip;
import org.springframework.format.annotation.DateTimeFormat;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.*;  
  
import java.time.LocalDate;  
import java.util.List;  
import java.util.UUID;  
  
@RestController  
@RequestMapping("/trajets/trips")  
@RequiredArgsConstructor  
public class TripController {  
      
    private final TripService tripService;  
      
    /**  
     * POST /trips/{tripId}/demarrer - Démarrer un trip  
     */  
    @PostMapping("/{tripId}/demarrer")  
    public ResponseEntity<TripResponseDTO> demarrerTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.demarrerTrip(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**  
     * POST /trips/{tripId}/terminer - Terminer un trip  
     */  
    @PostMapping("/{tripId}/terminer")  
    public ResponseEntity<TripResponseDTO> terminerTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.terminerTrip(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**  
     * POST /trips/{tripId}/annuler - Annuler un trip  
     */  
    @PostMapping("/{tripId}/annuler")  
    public ResponseEntity<TripResponseDTO> annulerTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.annulerTrip(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**  
     * POST /trips/{tripId}/confirmer-passage - Confirmer le passage à une station  
     */  
    @PostMapping("/{tripId}/confirmer-passage")  
    public ResponseEntity<TripResponseDTO> confirmerPassage(  
            @PathVariable UUID tripId,  
            @Valid @RequestBody ConfirmerPassageDTO dto) {  
        TripResponseDTO trip = tripService.confirmerPassageStation(tripId, dto);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**  
     * POST /trips/{tripId}/reserver-place - Réserver une place dans un trip  
     */  
    @PostMapping("/{tripId}/reserver-place")  
    public ResponseEntity<TripResponseDTO> reserverPlace(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.reserverPlace(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**  
     * GET /trips/{tripId} - Obtenir un trip par ID  
     */  
    @GetMapping("/{tripId}")  
    public ResponseEntity<TripResponseDTO> obtenirTrip(@PathVariable UUID tripId) {  
        TripResponseDTO trip = tripService.obtenirTripParId(tripId);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**  
     * GET /trips/numero/{numeroTrip} - Obtenir un trip par numéro  
     */  
    @GetMapping("/numero/{numeroTrip}")  
    public ResponseEntity<TripResponseDTO> obtenirTripParNumero(@PathVariable String numeroTrip) {  
        TripResponseDTO trip = tripService.obtenirTripParNumero(numeroTrip);  
        return ResponseEntity.ok(trip);  
    }  
      
    /**  
     * GET /trips/date/{date} - Obtenir tous les trips d'une date  
     */  
   @GetMapping("/date/{date}")  
    public ResponseEntity<List<TripResponseDTO>> obtenirTripsParDate(  
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
    // Utiliser obtenirTripsParDateEtStatut au lieu de obtenirTripsParDate  
    List<TripResponseDTO> trips = tripService.obtenirTripsParDateEtStatut(date, StatutTrip.PLANIFIE);  
    return ResponseEntity.ok(trips);  
}   
      
    /**  
     * GET /trips/ligne/{ligneId}/date/{date} - Obtenir les trips d'une ligne à une date  
     */  
    @GetMapping("/ligne/{ligneId}/date/{date}")  
    public ResponseEntity<List<TripResponseDTO>> obtenirTripsParLigneEtDate(  
            @PathVariable UUID ligneId,  
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
        List<TripResponseDTO> trips = tripService.obtenirTripsParLigneEtDate(ligneId, date);  
        return ResponseEntity.ok(trips);  
    }  
      
    /**  
     * GET /trips/bus/{busId}/date/{date} - Obtenir les trips d'un bus à une date  
     */  
    @GetMapping("/bus/{busId}/date/{date}")  
    public ResponseEntity<List<TripResponseDTO>> obtenirTripsParBusEtDate(  
            @PathVariable UUID busId,  
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
        List<TripResponseDTO> trips = tripService.obtenirTripsParBusEtDate(busId, date);  
        return ResponseEntity.ok(trips);  
    }  
      
    /**  
     * POST /trips/recherche - Rechercher des trips entre deux stations  
     */  
    @PostMapping("/rechercher")  
public ResponseEntity<List<TripResponseDTO>> rechercherTrips(  
        @Valid @RequestBody TripSearchDTO searchDTO) {  
    // Utiliser rechercherTrips au lieu de rechercherTripsEntreStations  
    List<TripResponseDTO> trips = tripService.rechercherTrips(searchDTO);  
    return ResponseEntity.ok(trips);  
}  
      
    /**  
     * GET /trips/station/{stationId}/date/{date} - Obtenir les trips passant par une station  
     */  
   @GetMapping("/station/{stationId}/date/{date}")  
public ResponseEntity<List<TripResponseDTO>> obtenirTripsParStation(  
        @PathVariable UUID stationId,  
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {  
    // Le nom est correct  
    List<TripResponseDTO> trips = tripService.obtenirTripsParStation(stationId, date);  
    return ResponseEntity.ok(trips);  
}
      
    /**  
     * GET /trips/{tripId}/places-disponibles - Vérifier les places disponibles  
     */  
    @GetMapping("/{tripId}/places-disponibles")  
    public ResponseEntity<Integer> obtenirPlacesDisponibles(@PathVariable UUID tripId) {  
        Integer places = tripService.obtenirPlacesDisponibles(tripId);  
        return ResponseEntity.ok(places);  
    }  
}