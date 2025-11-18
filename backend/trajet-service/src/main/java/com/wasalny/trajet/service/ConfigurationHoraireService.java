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
     * Obtenir toutes les configurations actives  
     */  
    public List<ConfigurationHoraireResponseDTO> obtenirConfigurationsActives() {  
        return configRepository.findByActiveTrue().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Mettre à jour une configuration  
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
        config.setDureeAllerMinutes(dto.getDureeAllerMinutes());  
        config.setDureeRetourMinutes(dto.getDureeRetourMinutes());  
        config.setTempsPauseMinutes(dto.getTempsPauseMinutes());  
        config.setTempsArretMinutes(dto.getTempsArretMinutes());  
          
        ConfigurationHoraire updated = configRepository.save(config);  
        return convertToResponseDTO(updated);  
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
     * Générer tous les trips d'une journée basés sur la configuration  
     */  
    public List<Trip> genererTripsJournee(UUID configId, LocalDate date) {  
        ConfigurationHoraire config = configRepository.findById(configId)  
            .orElseThrow(() -> new RuntimeException("Configuration non trouvée avec l'ID: " + configId));  
          
        if (!config.getActive()) {  
            throw new RuntimeException("La configuration n'est pas active");  
        }  
          
        // ✅ CORRECTION: Utiliser busActifs au lieu de busDisponibles  
        List<Bus> busActifs = busRepository.findByActiveTrue();  
        if (busActifs.size() < config.getNombreBus()) {  
            throw new RuntimeException("Pas assez de bus disponibles");  
        }  
          
        List<LigneStation> stations = ligneStationRepository.findByLigneIdOrderByOrdreAsc(config.getLigne().getId());  
        if (stations.isEmpty()) {  
            throw new RuntimeException("Aucune station configurée pour cette ligne");  
        }  
          
        List<Trip> trips = new ArrayList<>();  
        // ✅ CORRECTION: Utiliser busActifs au lieu de busDisponibles  
        List<Bus> busUtilises = busActifs.subList(0, config.getNombreBus());  
          
        LocalTime heureActuelle = config.getHeureDebut();  
        int busIndex = 0;  
        boolean sensAller = true;  
          
        while (heureActuelle.isBefore(config.getHeureFin())) {  
            Bus bus = busUtilises.get(busIndex);  
              
            Trip trip = new Trip();  
            trip.setNumeroTrip("TRIP-" + date + "-" + heureActuelle + "-" + (sensAller ? "A" : "R"));  
            trip.setBus(bus);  
            trip.setLigne(config.getLigne());  
            trip.setDateTrip(date);  
            trip.setHeureDepart(heureActuelle);  
            trip.setEstAller(sensAller);  
            trip.setStatut(StatutTrip.PLANIFIE);  
            trip.setTicketsVendus(0);  
              
            LocalTime heurePassage = heureActuelle;  
            List<LigneStation> stationsOrdonnees = sensAller ? stations :   
                new ArrayList<>(stations).stream()  
                    .sorted((a, b) -> b.getOrdre().compareTo(a.getOrdre()))  
                    .collect(Collectors.toList());  
              
            Trip savedTrip = tripRepository.save(trip);  
              
            for (int i = 0; i < stationsOrdonnees.size(); i++) {  
                LigneStation ls = stationsOrdonnees.get(i);  
                  
                PassageStation passage = new PassageStation();  
                passage.setTrip(savedTrip);  
                passage.setStation(ls.getStation());  
                passage.setOrdre(i + 1);  
                passage.setHeurePrevu(heurePassage);  
                passage.setRetardMinutes(0);  
                passage.setConfirme(false);  
                  
                passageStationRepository.save(passage);  
                  
                if (i < stationsOrdonnees.size() - 1) {  
                    double distance = ls.getDistanceCumuleeKm(); 
                    double vitesse = config.getLigne().getVitesseStandardKmH();  
                    int tempsTrajet = (int) ((distance / vitesse) * 60);  
                    heurePassage = heurePassage.plusMinutes(tempsTrajet + config.getTempsArretMinutes());  
                }  
            }  
              
            trips.add(savedTrip);  
              
            int duree = sensAller ? config.getDureeAllerMinutes() : config.getDureeRetourMinutes();  
            heureActuelle = heureActuelle.plusMinutes(duree + config.getTempsPauseMinutes());  
              
            sensAller = !sensAller;  
              
            if (sensAller) {  
                busIndex = (busIndex + 1) % busUtilises.size();  
            }  
        }  
          
        return trips;  
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