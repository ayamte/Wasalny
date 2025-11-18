package com.wasalny.trajet.service;

import com.wasalny.trajet.dto.request.ConfirmerPassageDTO;
import com.wasalny.trajet.dto.response.TripResponseDTO;
import com.wasalny.trajet.dto.response.PassageStationResponseDTO;
import com.wasalny.trajet.dto.simple.BusSimpleDTO;
import com.wasalny.trajet.dto.simple.LigneSimpleDTO;
import com.wasalny.trajet.dto.simple.StationSimpleDTO;
import com.wasalny.trajet.dto.search.TripSearchDTO;
import com.wasalny.trajet.entity.*;
import com.wasalny.trajet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final PassageStationRepository passageStationRepository;
    private final StationRepository stationRepository;
    private final BusRepository busRepository;
    private final LigneRepository ligneRepository;
    private final GeolocationClientService geolocationClientService;
/** Démarrer un trip */    
public TripResponseDTO demarrerTrip(UUID tripId) {    
    Trip trip = tripRepository.findById(tripId)    
            .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));    
    
    trip.demarrer();    
    
    // Confirmer automatiquement le passage à la première station    
    List<PassageStation> passages = passageStationRepository.findByTripIdOrderByOrdreAsc(tripId);    
    if (!passages.isEmpty()) {    
        PassageStation premierPassage = passages.get(0);    
          
        // CORRECTION : Utiliser l'heure de départ du trip au lieu de LocalTime.now()  
        premierPassage.confirmer(trip.getHeureDepart());    
        passageStationRepository.save(premierPassage);    
            
        // Mettre à jour la position du bus dans le geolocalisation-service    
        Station premiereStation = premierPassage.getStation();    
        geolocationClientService.updateBusLocation(    
            trip.getBus().getId(),    
            premiereStation.getLatitude(),    
            premiereStation.getLongitude()    
        );    
    }    
    
    Trip savedTrip = tripRepository.save(trip);    
    return convertToResponseDTO(savedTrip);    
}

    /** Terminer un trip */
    public TripResponseDTO terminerTrip(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));

        trip.terminer();
        Trip savedTrip = tripRepository.save(trip);
        return convertToResponseDTO(savedTrip);
    }

    /** Annuler un trip */
    public TripResponseDTO annulerTrip(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));

        trip.annuler();
        Trip savedTrip = tripRepository.save(trip);
        return convertToResponseDTO(savedTrip);
    }

    /** Confirmer le passage à une station */  
public TripResponseDTO confirmerPassageStation(UUID tripId, ConfirmerPassageDTO dto) {  
    Trip trip = tripRepository.findById(tripId)  
            .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));  
  
    List<PassageStation> passages = passageStationRepository.findByTripIdOrderByOrdreAsc(tripId);  
    PassageStation passage = passages.stream()  
            .filter(p -> p.getStation().getId().equals(dto.getStationId()))  
            .findFirst()  
            .orElseThrow(() -> new RuntimeException("Station non trouvée dans ce trip"));  
  
    // Confirmer le passage (calcule automatiquement le retard)  
    passage.confirmer(dto.getHeureReelle());  
    passageStationRepository.save(passage);  

     Station station = passage.getStation();  
    geolocationClientService.updateBusLocation(  
        trip.getBus().getId(),  
        station.getLatitude(),  
        station.getLongitude()  
    );  
  
    // Propager le retard aux stations suivantes non confirmées  
    int retardMinutes = passage.getRetardMinutes();  
      
    passages.stream()  
            .filter(p -> p.getOrdre() > passage.getOrdre() && !p.getConfirme())  
            .forEach(p -> {  
                // Mettre à jour le retard  
                p.setRetardMinutes(retardMinutes);  
                  
                // Recalculer l'heure estimée en ajoutant le retard à l'heure prévue  
                LocalTime nouvelleHeureEstimee = p.getHeurePrevu().plusMinutes(retardMinutes);  
                p.setHeureEstimee(nouvelleHeureEstimee);  
                  
                passageStationRepository.save(p);  
            });  
  
    // Sauvegarder le trip mis à jour  
    Trip savedTrip = tripRepository.save(trip);  
    return convertToResponseDTO(savedTrip);  
}

    /** Réserver une place dans un trip */
    public TripResponseDTO reserverPlace(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));

        trip.reserverPlace();
        Trip savedTrip = tripRepository.save(trip);
        return convertToResponseDTO(savedTrip);
    }

    /** Obtenir un trip par son ID */
    public TripResponseDTO obtenirTripParId(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));
        return convertToResponseDTO(trip);
    }

    /** Obtenir un trip par son numéro */
    public TripResponseDTO obtenirTripParNumero(String numeroTrip) {
        Trip trip = tripRepository.findByNumeroTrip(numeroTrip)
                .orElseThrow(() -> new RuntimeException("Trip non trouvé avec le numéro: " + numeroTrip));
        return convertToResponseDTO(trip);
    }

    /** Obtenir tous les trips d'une date avec un statut donné */
    public List<TripResponseDTO> obtenirTripsParDateEtStatut(LocalDate date, StatutTrip statut) {
        return tripRepository.findByDateTripAndStatut(date, statut).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /** Obtenir tous les trips d'un bus pour une date donnée */
    public List<TripResponseDTO> obtenirTripsParBusEtDate(UUID busId, LocalDate date) {
        return tripRepository.findByBusIdAndDateTrip(busId, date).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /** Obtenir tous les trips d'une ligne pour une date donnée */
    public List<TripResponseDTO> obtenirTripsParLigneEtDate(UUID ligneId, LocalDate date) {
        return tripRepository.findByLigneAndDate(ligneId, date).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /** Rechercher des trips entre deux stations pour une date donnée */
    public List<TripResponseDTO> rechercherTrips(TripSearchDTO searchDTO) {
        List<Trip> allTrips = tripRepository.findByDateTripAndStatut(searchDTO.getDate(), StatutTrip.PLANIFIE);
        allTrips.addAll(tripRepository.findByDateTripAndStatut(searchDTO.getDate(), StatutTrip.EN_COURS));

        return allTrips.stream()
                .filter(trip -> {
                    List<PassageStation> passages = passageStationRepository.findByTripIdOrderByOrdreAsc(trip.getId());
                    Integer ordreDepart = null;
                    Integer ordreArrivee = null;

                    for (PassageStation passage : passages) {
                        if (passage.getStation().getId().equals(searchDTO.getStationDepartId())) {
                            ordreDepart = passage.getOrdre();
                        }
                        if (passage.getStation().getId().equals(searchDTO.getStationArriveeId())) {
                            ordreArrivee = passage.getOrdre();
                        }
                    }

                    return ordreDepart != null && ordreArrivee != null && ordreDepart < ordreArrivee;
                })
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /** Obtenir tous les trips passant par une station pour une date donnée */
    public List<TripResponseDTO> obtenirTripsParStation(UUID stationId, LocalDate date) {
        List<Trip> allTrips = tripRepository.findByDateTripAndStatut(date, StatutTrip.PLANIFIE);
        allTrips.addAll(tripRepository.findByDateTripAndStatut(date, StatutTrip.EN_COURS));

        return allTrips.stream()
                .filter(trip -> {
                    List<PassageStation> passages = passageStationRepository.findByTripIdOrderByOrdreAsc(trip.getId());
                    return passages.stream().anyMatch(ps -> ps.getStation().getId().equals(stationId));
                })
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /** Calculer le nombre de places disponibles dans un trip */
    public Integer obtenirPlacesDisponibles(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));

        return trip.getBus().getCapacite() - trip.getTicketsVendus();
    }

    /** Conversion entité Trip -> DTO */
    public TripResponseDTO convertToResponseDTO(Trip trip) {
        TripResponseDTO dto = new TripResponseDTO();
        dto.setId(trip.getId());
        dto.setNumeroTrip(trip.getNumeroTrip());
        dto.setDateTrip(trip.getDateTrip());
        dto.setHeureDepart(trip.getHeureDepart());
        dto.setEstAller(trip.getEstAller());
        dto.setStatut(trip.getStatut());
        dto.setTicketsVendus(trip.getTicketsVendus());

        // Bus simplifié
        Bus bus = trip.getBus();
        BusSimpleDTO busDTO = new BusSimpleDTO();
        busDTO.setId(bus.getId());
        busDTO.setNumeroImmatriculation(bus.getNumeroImmatriculation());
        busDTO.setCapacite(bus.getCapacite());
        busDTO.setModele(bus.getModele());
        dto.setBus(busDTO);

        // Ligne simplifiée
        Ligne ligne = trip.getLigne();
        LigneSimpleDTO ligneDTO = new LigneSimpleDTO();
        ligneDTO.setId(ligne.getId());
        ligneDTO.setNumero(ligne.getNumero());
        ligneDTO.setNom(ligne.getNom());
        ligneDTO.setPrixStandard(ligne.getPrixStandard());
        dto.setLigne(ligneDTO);

        // Passages aux stations
        List<PassageStation> passages = passageStationRepository.findByTripIdOrderByOrdreAsc(trip.getId());
        dto.setPassages(passages.stream()
                .map(this::convertPassageToDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    /** Conversion PassageStation -> DTO */
    private PassageStationResponseDTO convertPassageToDTO(PassageStation passage) {
        PassageStationResponseDTO dto = new PassageStationResponseDTO();
        dto.setId(passage.getId());
        dto.setOrdre(passage.getOrdre());
        dto.setHeurePrevu(passage.getHeurePrevu());
        dto.setHeureReelle(passage.getHeureReelle());
        dto.setHeureEstimee(passage.obtenirHeureEstimee());
        dto.setRetardMinutes(passage.getRetardMinutes());
        dto.setConfirme(passage.getConfirme());

        // Station simplifiée
        Station station = passage.getStation();
        StationSimpleDTO stationDTO = new StationSimpleDTO();
        stationDTO.setId(station.getId());
        stationDTO.setNom(station.getNom());
        stationDTO.setLatitude(station.getLatitude());
        stationDTO.setLongitude(station.getLongitude());
        dto.setStation(stationDTO);

        return dto;
    }
}