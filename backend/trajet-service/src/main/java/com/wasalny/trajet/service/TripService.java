package com.wasalny.trajet.service;

import com.wasalny.trajet.dto.request.ConfirmerPassageDTO;
import com.wasalny.trajet.dto.request.TripUpdateDTO;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
    private final AssignationBusConducteurRepository assignationRepository;
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
                .map(trip -> this.convertToSearchResponseDTO(trip, searchDTO.getStationDepartId(), searchDTO.getStationArriveeId()))
                .collect(Collectors.toList());
    }

    /** Conversion entité Trip -> DTO pour la recherche (affichage simplifié: départ + arrivée demandés) */
    private TripResponseDTO convertToSearchResponseDTO(Trip trip, UUID stationDepartId, UUID stationArriveeId) {
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

        // Prix du trip = prix standard de la ligne
        dto.setPrix(ligne.getPrixStandard());

        // MODIFICATION POUR RECHERCHE: Ne retourner que la station de départ et la station d'arrivée demandées
        List<PassageStation> tousLesPassages = passageStationRepository.findByTripIdOrderByOrdreAsc(trip.getId());

        if (!tousLesPassages.isEmpty()) {
            // Trouver le passage de départ (station demandée par le client)
            PassageStation passageDepart = tousLesPassages.stream()
                .filter(p -> p.getStation().getId().equals(stationDepartId))
                .findFirst()
                .orElse(tousLesPassages.get(0)); // Fallback: première station

            // Trouver le passage d'arrivée (station demandée par le client)
            PassageStation passageArrivee = tousLesPassages.stream()
                .filter(p -> p.getStation().getId().equals(stationArriveeId))
                .findFirst()
                .orElse(tousLesPassages.get(tousLesPassages.size() - 1)); // Fallback: dernière station

            // Ne retourner que ces 2 passages (départ et arrivée demandés par le client)
            dto.setPassages(List.of(
                convertPassageToDTO(passageDepart),
                convertPassageToDTO(passageArrivee)
            ));

            // Heure d'arrivée estimée = heure de la station d'arrivée demandée
            dto.setHeureArriveeEstimee(passageArrivee.obtenirHeureEstimee());
        } else {
            // Fallback si pas de passages
            dto.setPassages(List.of());
            dto.setHeureArriveeEstimee(trip.getHeureDepart());
        }

        // Calculer places disponibles
        dto.setPlacesDisponibles(bus.getCapacite() - trip.getTicketsVendus());

        return dto;
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

        // Prix du trip = prix standard de la ligne
        dto.setPrix(ligne.getPrixStandard());

        // Passages aux stations
        List<PassageStation> passages = passageStationRepository.findByTripIdOrderByOrdreAsc(trip.getId());
        dto.setPassages(passages.stream()
                .map(this::convertPassageToDTO)
                .collect(Collectors.toList()));

        // Calculer l'heure d'arrivée estimée (dernière station)
        if (!passages.isEmpty()) {
            PassageStation derniereStation = passages.get(passages.size() - 1);
            dto.setHeureArriveeEstimee(derniereStation.obtenirHeureEstimee());
        } else {
            // Fallback si pas de passages : utiliser l'heure de départ
            dto.setHeureArriveeEstimee(trip.getHeureDepart());
        }

        // Calculer places disponibles
        dto.setPlacesDisponibles(bus.getCapacite() - trip.getTicketsVendus());

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

    /**
     * Supprimer un trip
     */
    public void supprimerTrip(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));

        // Vérifier qu'on ne peut pas supprimer un trip en cours ou terminé
        if (trip.getStatut() == StatutTrip.EN_COURS) {
            throw new RuntimeException("Impossible de supprimer un trip en cours");
        }
        if (trip.getStatut() == StatutTrip.TERMINE) {
            throw new RuntimeException("Impossible de supprimer un trip terminé");
        }

        // Supprimer d'abord les passages de stations associés
        passageStationRepository.deleteByTripId(tripId);

        // Puis supprimer le trip
        tripRepository.delete(trip);
    }

    /**
     * Obtenir tous les trips avec filtres optionnels
     */
    @Transactional(readOnly = true)
    public List<TripResponseDTO> obtenirTripsAvecFiltres(LocalDate dateDebut, LocalDate dateFin, UUID ligneId, StatutTrip statut) {
        List<Trip> trips;

        if (dateDebut != null && dateFin != null) {
            trips = tripRepository.findByDateTripBetween(dateDebut, dateFin);
        } else if (dateDebut != null) {
            trips = tripRepository.findByDateTrip(dateDebut);
        } else {
            trips = tripRepository.findAll();
        }

        // Appliquer les filtres additionnels
        if (ligneId != null) {
            trips = trips.stream()
                .filter(trip -> {
                    // Force eager loading de la ligne
                    Ligne ligne = trip.getLigne();
                    return ligne != null && ligne.getId().equals(ligneId);
                })
                .collect(Collectors.toList());
        }

        if (statut != null) {
            trips = trips.stream()
                .filter(trip -> trip.getStatut() == statut)
                .collect(Collectors.toList());
        }

        return trips.stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    /**
     * Modifier un trip existant
     */
    public TripResponseDTO modifierTrip(UUID tripId, TripUpdateDTO updateDTO) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip non trouvé avec l'ID: " + tripId));

        // Vérifier que le trip peut être modifié
        if (trip.getStatut() == StatutTrip.TERMINE) {
            throw new RuntimeException("Impossible de modifier un trip terminé");
        }

        // Appliquer les modifications seulement si les champs ne sont pas null
        if (updateDTO.getDateTrip() != null) {
            trip.setDateTrip(updateDTO.getDateTrip());
        }

        if (updateDTO.getHeureDepart() != null) {
            trip.setHeureDepart(updateDTO.getHeureDepart());
        }

        if (updateDTO.getBusId() != null) {
            // Vérifier que le nouveau bus existe
            Bus nouveauBus = busRepository.findById(updateDTO.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'ID: " + updateDTO.getBusId()));
            trip.setBus(nouveauBus);
        }

        if (updateDTO.getStatut() != null) {
            // Valider les transitions de statut
            if (trip.getStatut() == StatutTrip.EN_COURS && updateDTO.getStatut() == StatutTrip.PLANIFIE) {
                throw new RuntimeException("Impossible de repasser un trip en cours à l'état planifié");
            }
            trip.setStatut(updateDTO.getStatut());
        }

        if (updateDTO.getEstAller() != null) {
            trip.setEstAller(updateDTO.getEstAller());
        }

        Trip tripModifie = tripRepository.save(trip);
        return convertToResponseDTO(tripModifie);
    }

    /**
     * Obtenir le trip assigné au conducteur actuel (prochain trip planifié)
     */
    public TripResponseDTO obtenirTripAssigne() {
        // Récupérer l'ID du conducteur depuis le contexte de sécurité
        UUID conducteurId = getConducteurIdFromContext();

        // Trouver l'assignation active pour aujourd'hui
        LocalDate today = LocalDate.now();
        List<AssignationBusConducteur> assignations = assignationRepository
            .findByConducteurId(conducteurId)
            .stream()
            .filter(a -> a.getActive() &&
                        !today.isBefore(a.getDateDebut()) &&
                        !today.isAfter(a.getDateFin()))
            .toList();

        if (assignations.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucune assignation active pour le conducteur");
        }

        // Récupérer le bus assigné
        Bus bus = assignations.get(0).getBus();

        // Chercher le prochain trip planifié pour ce bus aujourd'hui
        LocalTime now = LocalTime.now();
        List<Trip> trips = tripRepository.findByBusIdAndDateTrip(bus.getId(), today)
            .stream()
            .filter(t -> t.getStatut() == StatutTrip.PLANIFIE && t.getHeureDepart().isAfter(now))
            .sorted((t1, t2) -> t1.getHeureDepart().compareTo(t2.getHeureDepart()))
            .toList();

        if (trips.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun trip assigné pour aujourd'hui");
        }

        return convertToResponseDTO(trips.get(0));
    }

    /**
     * Obtenir le trip actuellement actif (EN_COURS) du conducteur
     */
    public TripResponseDTO obtenirTripActif() {
        // Récupérer l'ID du conducteur depuis le contexte de sécurité
        UUID conducteurId = getConducteurIdFromContext();

        // Trouver l'assignation active pour aujourd'hui
        LocalDate today = LocalDate.now();
        List<AssignationBusConducteur> assignations = assignationRepository
            .findByConducteurId(conducteurId)
            .stream()
            .filter(a -> a.getActive() &&
                        !today.isBefore(a.getDateDebut()) &&
                        !today.isAfter(a.getDateFin()))
            .toList();

        if (assignations.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucune assignation active pour le conducteur");
        }

        // Récupérer le bus assigné
        Bus bus = assignations.get(0).getBus();

        // Chercher le trip EN_COURS pour ce bus
        List<Trip> trips = tripRepository.findByBusIdAndDateTrip(bus.getId(), today)
            .stream()
            .filter(t -> t.getStatut() == StatutTrip.EN_COURS)
            .toList();

        if (trips.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun trip actif en cours");
        }

        return convertToResponseDTO(trips.get(0));
    }

    /**
     * Méthode utilitaire pour extraire l'ID du conducteur du contexte de sécurité
     */
    private UUID getConducteurIdFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non authentifié");
        }

        String conducteurIdStr = authentication.getName();
        try {
            return UUID.fromString(conducteurIdStr);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID conducteur invalide");
        }
    }
}