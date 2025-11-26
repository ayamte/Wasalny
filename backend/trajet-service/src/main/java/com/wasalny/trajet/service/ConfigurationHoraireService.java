package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.request.ConfigurationHoraireCreateDTO;  
import com.wasalny.trajet.dto.response.ConfigurationHoraireResponseDTO;  
import com.wasalny.trajet.dto.simple.LigneSimpleDTO;  
import com.wasalny.trajet.entity.*;  
import com.wasalny.trajet.repository.*;  
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
  
import java.time.LocalDate;  
import java.time.LocalTime;  
import java.util.ArrayList;  
import java.util.List;  
import java.util.UUID;  
import java.util.stream.Collectors;  
  
@Service
@Transactional
@RequiredArgsConstructor
public class ConfigurationHoraireService {

    private final ConfigurationHoraireRepository configRepository;
    private final LigneRepository ligneRepository;
    private final BusRepository busRepository;
    private final TripRepository tripRepository;
    private final LigneStationRepository ligneStationRepository;
    private final PassageStationRepository passageStationRepository;
    private final BusAssignmentRepository busAssignmentRepository;  
      
    /**  
     * Créer une nouvelle configuration horaire  
     */  
    public ConfigurationHoraireResponseDTO creerConfiguration(ConfigurationHoraireCreateDTO dto) {  
        Ligne ligne = ligneRepository.findById(dto.getLigneId())  
            .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + dto.getLigneId()));  
          
        ConfigurationHoraire config = new ConfigurationHoraire();
        config.setLigne(ligne);
        config.setHeureDebut(dto.getHeureDebut());
        config.setHeureFin(dto.getHeureFin());
        config.setFrequenceMinutes(dto.getFrequenceMinutes());
        config.setNombreBus(dto.getNombreBus());
        config.setNombreBusDepart(dto.getNombreBusDepart());              // ✅ NOUVEAU
        config.setNombreBusDestination(dto.getNombreBusDestination());    // ✅ NOUVEAU
        config.setDureeAllerMinutes(dto.getDureeAllerMinutes());
        config.setDureeRetourMinutes(dto.getDureeRetourMinutes());
        config.setTempsPauseMinutes(dto.getTempsPauseMinutes());
        config.setTempsArretMinutes(dto.getTempsArretMinutes());
        config.setActive(true);

        ConfigurationHoraire saved = configRepository.save(config);
        return convertToResponseDTO(saved);
    }  
      
    /**  
     * Obtenir une configuration par ID  
     */  
    public ConfigurationHoraireResponseDTO obtenirConfigurationParId(UUID id) {  
        ConfigurationHoraire config = configRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée avec l'ID: " + id));  
        return convertToResponseDTO(config);  
    }  
      
    /**  
     * Obtenir toutes les configurations d'une ligne  
     */  
    public List<ConfigurationHoraireResponseDTO> obtenirConfigurationsParLigne(UUID ligneId) {  
        return configRepository.findByLigneId(ligneId).stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**
     * Obtenir toutes les configurations
     */
    public List<ConfigurationHoraireResponseDTO> obtenirToutesConfigurations() {
        return configRepository.findAll().stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    /**
     * Obtenir toutes les configurations actives
     */
    public List<ConfigurationHoraireResponseDTO> obtenirConfigurationsActives() {
        return configRepository.findByActiveTrue().stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }  
      
    /**
     * Mettre à jour une configuration
     * ✅ AMÉLIORATION: Supprime et régénère automatiquement tous les trips futurs
     */
    public ConfigurationHoraireResponseDTO mettreAJourConfiguration(UUID id, ConfigurationHoraireCreateDTO dto) {
        ConfigurationHoraire config = configRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée avec l'ID: " + id));

        Ligne ligne = ligneRepository.findById(dto.getLigneId())
            .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + dto.getLigneId()));

        config.setLigne(ligne);
        config.setHeureDebut(dto.getHeureDebut());
        config.setHeureFin(dto.getHeureFin());
        config.setFrequenceMinutes(dto.getFrequenceMinutes());
        config.setNombreBus(dto.getNombreBus());
        config.setNombreBusDepart(dto.getNombreBusDepart());              // ✅ NOUVEAU
        config.setNombreBusDestination(dto.getNombreBusDestination());    // ✅ NOUVEAU
        config.setDureeAllerMinutes(dto.getDureeAllerMinutes());
        config.setDureeRetourMinutes(dto.getDureeRetourMinutes());
        config.setTempsPauseMinutes(dto.getTempsPauseMinutes());
        config.setTempsArretMinutes(dto.getTempsArretMinutes());

        ConfigurationHoraire updated = configRepository.save(config);

        // ✅ NOUVEAU: Régénérer tous les trips futurs (non commencés)
        try {
            regenererTripsFuturs(updated);
        } catch (Exception e) {
            System.err.println("Erreur lors de la régénération des trips futurs: " + e.getMessage());
            // Ne pas bloquer la mise à jour de la configuration
        }

        return convertToResponseDTO(updated);
    }

    /**
     * Régénère tous les trips futurs pour une configuration
     * Supprime les trips PLANIFIÉS (pas encore commencés) et les régénère
     */
    private void regenererTripsFuturs(ConfigurationHoraire config) {
        LocalDate aujourdhui = LocalDate.now();

        // Trouver tous les trips futurs de cette ligne qui sont PLANIFIÉS
        List<Trip> tripsFuturs = tripRepository.findAll().stream()
            .filter(trip -> trip.getLigne().getId().equals(config.getLigne().getId()))
            .filter(trip -> trip.getDateTrip().isAfter(aujourdhui) || trip.getDateTrip().isEqual(aujourdhui))
            .filter(trip -> trip.getStatut() == StatutTrip.PLANIFIE)
            .collect(Collectors.toList());

        if (tripsFuturs.isEmpty()) {
            System.out.println("Aucun trip futur à régénérer");
            return;
        }

        // Grouper par date
        java.util.Map<LocalDate, List<Trip>> tripsParDate = tripsFuturs.stream()
            .collect(Collectors.groupingBy(Trip::getDateTrip));

        System.out.println("Régénération de " + tripsFuturs.size() + " trips sur " + tripsParDate.size() + " jours");

        // Pour chaque date, supprimer et régénérer
        for (LocalDate date : tripsParDate.keySet()) {
            List<Trip> tripsASupprimer = tripsParDate.get(date);

            // Supprimer les passages stations puis les trips
            for (Trip trip : tripsASupprimer) {
                passageStationRepository.deleteByTripId(trip.getId());
                tripRepository.delete(trip);
            }

            // Régénérer les trips pour cette date
            try {
                genererTripsJournee(config.getId(), date);
                System.out.println("Trips régénérés pour " + date);
            } catch (Exception e) {
                System.err.println("Erreur lors de la régénération pour " + date + ": " + e.getMessage());
            }
        }
    }  
      
    /**  
     * Supprimer une configuration  
     */  
    public void supprimerConfiguration(UUID id) {  
        ConfigurationHoraire config = configRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée avec l'ID: " + id));  
        configRepository.delete(config);  
    }  
      
    /**  
     * Activer une configuration  
     */  
    public void activerConfiguration(UUID id) {  
        ConfigurationHoraire config = configRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée avec l'ID: " + id));  
        config.setActive(true);  
        configRepository.save(config);  
    }  
      
    /**  
     * Désactiver une configuration  
     */  
    public void desactiverConfiguration(UUID id) {  
        ConfigurationHoraire config = configRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée avec l'ID: " + id));  
        config.setActive(false);  
        configRepository.save(config);  
    }  
      
    /**
     * Générer tous les trips pour une période (plusieurs jours)
     */
    public List<Trip> genererTripsPeriode(UUID configId, LocalDate dateDebut, LocalDate dateFin) {
        List<Trip> tousLesTrips = new ArrayList<>();

        LocalDate currentDate = dateDebut;
        while (!currentDate.isAfter(dateFin)) {
            try {
                List<Trip> tripsJour = genererTripsJournee(configId, currentDate);
                tousLesTrips.addAll(tripsJour);
            } catch (Exception e) {
                // Log l'erreur mais continue pour les autres jours
                System.err.println("Erreur lors de la génération des trips pour " + currentDate + ": " + e.getMessage());
            }
            currentDate = currentDate.plusDays(1);
        }

        return tousLesTrips;
    }

    /**
     * Générer tous les trips d'une journée basés sur la configuration
     */
    public List<Trip> genererTripsJournee(UUID configId, LocalDate date) {
        ConfigurationHoraire config = configRepository.findById(configId)
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée avec l'ID: " + configId));

        if (!config.getActive()) {
            throw new RuntimeException("La configuration n'est pas active");
        }

        // ✅ IMPORTANT: Supprimer les anciens trips PLANIFIE pour cette ligne et cette date
        // avant de générer de nouveaux trips (évite les doublons)
        List<Trip> ancienTrips = tripRepository.findByLigneAndDate(config.getLigne().getId(), date).stream()
            .filter(trip -> trip.getStatut() == StatutTrip.PLANIFIE)
            .collect(Collectors.toList());

        if (!ancienTrips.isEmpty()) {
            System.out.println("Suppression de " + ancienTrips.size() + " anciens trips PLANIFIE pour la ligne " +
                config.getLigne().getNumero() + " le " + date);
            for (Trip trip : ancienTrips) {
                passageStationRepository.deleteByTripId(trip.getId());
                tripRepository.delete(trip);
            }
        }

        // ✅ NOUVELLE LOGIQUE: Filtrer les bus selon leur station de départ configurée
        List<BusAssignment> assignments = busAssignmentRepository.findByLigneIdAndActiveTrue(config.getLigne().getId());
        if (assignments.isEmpty()) {
            throw new RuntimeException("Aucun bus assigné à cette ligne. Veuillez d'abord assigner des bus.");
        }

        List<LigneStation> stations = ligneStationRepository.findByLigneIdOrderByOrdreAsc(config.getLigne().getId());
        if (stations.isEmpty()) {
            throw new RuntimeException("Aucune station configurée pour cette ligne");
        }

        List<Trip> trips = new ArrayList<>();

        // ✅ AMÉLIORATION: Séparer les bus selon leur station de départ configurée
        List<Bus> busAuDepart = assignments.stream()
            .filter(a -> a.getCommenceAStationDepart() != null && a.getCommenceAStationDepart())
            .map(BusAssignment::getBus)
            .collect(Collectors.toList());

        List<Bus> busADestination = assignments.stream()
            .filter(a -> a.getCommenceAStationDepart() != null && !a.getCommenceAStationDepart())
            .map(BusAssignment::getBus)
            .collect(Collectors.toList());

        // Validation: Vérifier que le nombre de bus correspond à la configuration
        if (busAuDepart.size() != config.getNombreBusDepart()) {
            throw new RuntimeException("Nombre de bus au départ incorrect: " + busAuDepart.size() +
                " bus assignés au départ (Station A), " + config.getNombreBusDepart() +
                " attendus. Veuillez configurer les assignations dans Gestion des Bus.");
        }

        if (busADestination.size() != config.getNombreBusDestination()) {
            throw new RuntimeException("Nombre de bus à la destination incorrect: " + busADestination.size() +
                " bus assignés à la destination (Station B), " + config.getNombreBusDestination() +
                " attendus. Veuillez configurer les assignations dans Gestion des Bus.");
        }

        System.out.println("🚌 Génération des trips pour le " + date);
        System.out.println("   - " + busAuDepart.size() + " bus au départ (Station A)");
        System.out.println("   - " + busADestination.size() + " bus à la destination (Station B)");
        System.out.println("   - Fréquence: un bus toutes les " + config.getFrequenceMinutes() + " minutes");
        System.out.println("   - Plage horaire: " + config.getHeureDebut() + " → " + config.getHeureFin());

        // ✅ GÉNÉRATION DES TRIPS POUR LES BUS AU DÉPART (STATION A)
        for (int busIdx = 0; busIdx < busAuDepart.size(); busIdx++) {
            Bus bus = busAuDepart.get(busIdx);

            // Premier départ avec décalage
            LocalTime heureActuelle = config.getHeureDebut().plusMinutes(busIdx * config.getFrequenceMinutes());

            while (heureActuelle.isBefore(config.getHeureFin())) {
                // ===== TRIP ALLER (A → B) =====
                Trip allerTrip = creerTrip(bus, config.getLigne(), date, heureActuelle, true);
                Trip savedAllerTrip = tripRepository.save(allerTrip);
                creerPassagesStations(savedAllerTrip, stations, heureActuelle, config.getTempsArretMinutes(), false);
                trips.add(savedAllerTrip);

                // ===== PAUSE À LA STATION B =====
                LocalTime heureApresAller = heureActuelle.plusMinutes(config.getDureeAllerMinutes());
                LocalTime departRetour = heureApresAller.plusMinutes(config.getTempsPauseMinutes());

                // ===== TRIP RETOUR (B → A) =====
                if (departRetour.isBefore(config.getHeureFin())) {
                    Trip retourTrip = creerTrip(bus, config.getLigne(), date, departRetour, false);
                    Trip savedRetourTrip = tripRepository.save(retourTrip);
                    creerPassagesStations(savedRetourTrip, stations, departRetour, config.getTempsArretMinutes(), true);
                    trips.add(savedRetourTrip);

                    // ===== PAUSE À LA STATION A =====
                    LocalTime heureApresRetour = departRetour.plusMinutes(config.getDureeRetourMinutes());
                    heureActuelle = heureApresRetour.plusMinutes(config.getTempsPauseMinutes());
                } else {
                    break; // Pas assez de temps pour le retour
                }
            }
        }

        // ✅ GÉNÉRATION DES TRIPS POUR LES BUS À LA DESTINATION (STATION B)
        for (int busIdx = 0; busIdx < busADestination.size(); busIdx++) {
            Bus bus = busADestination.get(busIdx);

            // Premier départ avec décalage
            LocalTime heureActuelle = config.getHeureDebut().plusMinutes(busIdx * config.getFrequenceMinutes());

            while (heureActuelle.isBefore(config.getHeureFin())) {
                // ===== TRIP RETOUR (B → A) =====
                Trip retourTrip = creerTrip(bus, config.getLigne(), date, heureActuelle, false);
                Trip savedRetourTrip = tripRepository.save(retourTrip);
                creerPassagesStations(savedRetourTrip, stations, heureActuelle, config.getTempsArretMinutes(), true);
                trips.add(savedRetourTrip);

                // ===== PAUSE À LA STATION A =====
                LocalTime heureApresRetour = heureActuelle.plusMinutes(config.getDureeRetourMinutes());
                LocalTime departAller = heureApresRetour.plusMinutes(config.getTempsPauseMinutes());

                // ===== TRIP ALLER (A → B) =====
                if (departAller.isBefore(config.getHeureFin())) {
                    Trip allerTrip = creerTrip(bus, config.getLigne(), date, departAller, true);
                    Trip savedAllerTrip = tripRepository.save(allerTrip);
                    creerPassagesStations(savedAllerTrip, stations, departAller, config.getTempsArretMinutes(), false);
                    trips.add(savedAllerTrip);

                    // ===== PAUSE À LA STATION B =====
                    LocalTime heureApresAller = departAller.plusMinutes(config.getDureeAllerMinutes());
                    heureActuelle = heureApresAller.plusMinutes(config.getTempsPauseMinutes());
                } else {
                    break; // Pas assez de temps pour l'aller
                }
            }
        }

        System.out.println("✅ " + trips.size() + " trips générés avec succès");
        return trips;
    }  
      
    /**
     * ✅ MÉTHODE HELPER: Créer un trip
     */
    private Trip creerTrip(Bus bus, Ligne ligne, LocalDate date, LocalTime heureDepart, boolean estAller) {
        Trip trip = new Trip();
        String direction = estAller ? "A" : "R";
        trip.setNumeroTrip("TRIP-" + date + "-" + heureDepart + "-" + direction + "-" + bus.getNumeroImmatriculation());
        trip.setBus(bus);
        trip.setLigne(ligne);
        trip.setDateTrip(date);
        trip.setHeureDepart(heureDepart);
        trip.setEstAller(estAller);
        trip.setStatut(StatutTrip.PLANIFIE);
        trip.setTicketsVendus(0);
        return trip;
    }

    /**
     * ✅ MÉTHODE HELPER: Créer les passages aux stations
     */
    private void creerPassagesStations(Trip trip, List<LigneStation> stations, LocalTime heureDebut,
                                      int tempsArretMinutes, boolean inverse) {
        List<LigneStation> stationsOrdonnees = inverse
            ? stations.stream()
                .sorted((a, b) -> b.getOrdre().compareTo(a.getOrdre()))
                .collect(Collectors.toList())
            : new ArrayList<>(stations);

        LocalTime heurePassage = heureDebut;

        for (int i = 0; i < stationsOrdonnees.size(); i++) {
            LigneStation ls = stationsOrdonnees.get(i);
            PassageStation passage = new PassageStation();
            passage.setTrip(trip);
            passage.setStation(ls.getStation());
            passage.setOrdre(i + 1);
            passage.setHeurePrevu(heurePassage);
            passage.setRetardMinutes(0);
            passage.setConfirme(false);
            passageStationRepository.save(passage);

            // Calculer l'heure du prochain passage (sauf pour la dernière station)
            if (i < stationsOrdonnees.size() - 1) {
                // Utiliser la distance entre cette station et la suivante
                LigneStation prochaineLs = stationsOrdonnees.get(i + 1);
                double distanceEntreStations = Math.abs(prochaineLs.getDistanceCumuleeKm() - ls.getDistanceCumuleeKm());
                double vitesse = trip.getLigne().getVitesseStandardKmH();
                int tempsTrajet = (int) ((distanceEntreStations / vitesse) * 60);
                heurePassage = heurePassage.plusMinutes(tempsTrajet + tempsArretMinutes);
            }
        }
    }

    /**
     * Conversion entité -> DTO
     */
    private ConfigurationHoraireResponseDTO convertToResponseDTO(ConfigurationHoraire config) {  
        ConfigurationHoraireResponseDTO dto = new ConfigurationHoraireResponseDTO();  
        dto.setId(config.getId());  
        dto.setHeureDebut(config.getHeureDebut());  
        dto.setHeureFin(config.getHeureFin());  
        dto.setFrequenceMinutes(config.getFrequenceMinutes());  
        dto.setNombreBus(config.getNombreBus());  
        dto.setDureeAllerMinutes(config.getDureeAllerMinutes());
        dto.setDureeRetourMinutes(config.getDureeRetourMinutes());
        dto.setTempsPauseMinutes(config.getTempsPauseMinutes());
        dto.setTempsArretMinutes(config.getTempsArretMinutes());
        dto.setNombreBusDepart(config.getNombreBusDepart());              // ✅ NOUVEAU
        dto.setNombreBusDestination(config.getNombreBusDestination());    // ✅ NOUVEAU
        dto.setActive(config.getActive());

        Ligne ligne = config.getLigne();
        LigneSimpleDTO ligneDTO = new LigneSimpleDTO();
        ligneDTO.setId(ligne.getId());
        ligneDTO.setNumero(ligne.getNumero());
        ligneDTO.setNom(ligne.getNom());
        ligneDTO.setPrixStandard(ligne.getPrixStandard());
        dto.setLigne(ligneDTO);

        return dto;
    }
}