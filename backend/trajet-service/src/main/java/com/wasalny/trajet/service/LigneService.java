package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.request.LigneCreateDTO;  
import com.wasalny.trajet.dto.request.LigneStationCreateDTO;  
import com.wasalny.trajet.dto.response.LigneResponseDTO;  
import com.wasalny.trajet.dto.response.LigneStationResponseDTO;  
import com.wasalny.trajet.dto.simple.StationSimpleDTO;  
import com.wasalny.trajet.entity.Ligne;  
import com.wasalny.trajet.entity.LigneStation;  
import com.wasalny.trajet.entity.Station;  
import com.wasalny.trajet.repository.LigneRepository;  
import com.wasalny.trajet.repository.LigneStationRepository;  
import com.wasalny.trajet.repository.StationRepository;  
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
  
import java.util.List;  
import java.util.UUID;  
import java.util.stream.Collectors;  
  
@Service  
@Transactional  
@RequiredArgsConstructor  
public class LigneService {  
  
    private final LigneRepository ligneRepository;  
    private final StationRepository stationRepository;  
    private final LigneStationRepository ligneStationRepository;  
  
    /**  
     * Créer une nouvelle ligne avec stations de départ et d'arrivée  
     */  
    public LigneResponseDTO creerLigne(LigneCreateDTO dto) {  
        // Vérifier que les stations existent  
        Station stationDepart = stationRepository.findById(dto.getStationDepartId())  
            .orElseThrow(() -> new RuntimeException("Station de départ introuvable"));  
          
        Station stationArrivee = stationRepository.findById(dto.getStationArriveeId())  
            .orElseThrow(() -> new RuntimeException("Station d'arrivée introuvable"));  
  
        // Créer la ligne  
        Ligne ligne = new Ligne();  
        ligne.setNumero(dto.getNumero());  
        ligne.setNom(dto.getNom());  
        ligne.setPrixStandard(dto.getPrixStandard());  
        ligne.setVitesseStandardKmH(dto.getVitesseStandardKmH());  
        ligne.setActive(true);  
          
        Ligne savedLigne = ligneRepository.save(ligne);  
  
        // ✅ MODIFICATION IMPORTANTE : Créer automatiquement les LigneStation  
        // Calculer la distance entre départ et arrivée  
        double distance = calculerDistance(  
            stationDepart.getLatitude(),   
            stationDepart.getLongitude(),  
            stationArrivee.getLatitude(),   
            stationArrivee.getLongitude()  
        );  
  
        // Créer LigneStation pour la station de départ  
        LigneStation ligneStationDepart = new LigneStation();  
        ligneStationDepart.setLigne(savedLigne);  
        ligneStationDepart.setStation(stationDepart);  
        ligneStationDepart.setOrdre(1);  
        ligneStationDepart.setDistanceKmDepart(0.0);  
        ligneStationDepart.setTempsArretMinutes(2); // Temps d'arrêt par défaut  
        ligneStationRepository.save(ligneStationDepart);  
  
        // Créer LigneStation pour la station d'arrivée  
        LigneStation ligneStationArrivee = new LigneStation();  
        ligneStationArrivee.setLigne(savedLigne);  
        ligneStationArrivee.setStation(stationArrivee);  
        ligneStationArrivee.setOrdre(2);  
        ligneStationArrivee.setDistanceKmDepart(distance);  
        ligneStationArrivee.setTempsArretMinutes(2); // Temps d'arrêt par défaut  
        ligneStationRepository.save(ligneStationArrivee);  
  
        return convertToResponseDTO(savedLigne);  
    }  
  
    /**  
     * Ajouter une station intermédiaire à une ligne existante  
     */  
    public LigneStationResponseDTO ajouterStationALigne(LigneStationCreateDTO dto) {  
        Ligne ligne = ligneRepository.findById(dto.getLigneId())  
            .orElseThrow(() -> new RuntimeException("Ligne introuvable"));  
          
        Station station = stationRepository.findById(dto.getStationId())  
            .orElseThrow(() -> new RuntimeException("Station introuvable"));  
  
        LigneStation ligneStation = new LigneStation();  
        ligneStation.setLigne(ligne);  
        ligneStation.setStation(station);  
        ligneStation.setOrdre(dto.getOrdre());  
        ligneStation.setDistanceKmDepart(dto.getDistanceKmDepart());  
        ligneStation.setTempsArretMinutes(dto.getTempsArretMinutes() != null ? dto.getTempsArretMinutes() : 2);  
          
        LigneStation saved = ligneStationRepository.save(ligneStation);  
        return convertToLigneStationResponseDTO(saved);  
    }  
  
    /**  
     * Obtenir une ligne par ID  
     */  
    public LigneResponseDTO obtenirLigneParId(UUID id) {  
        Ligne ligne = ligneRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ligne introuvable"));  
        return convertToResponseDTO(ligne);  
    }  
  
    /**  
     * Obtenir toutes les lignes  
     */  
    public List<LigneResponseDTO> obtenirToutesLesLignes() {  
        return ligneRepository.findAll().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
  
    /**  
     * Obtenir les lignes actives  
     */  
    public List<LigneResponseDTO> obtenirLignesActives() {  
        return ligneRepository.findByActiveTrue().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
  
    /**  
     * Obtenir les stations d'une ligne  
     */  
    public List<LigneStationResponseDTO> obtenirStationsDeLigne(UUID ligneId) {  
        Ligne ligne = ligneRepository.findById(ligneId)  
            .orElseThrow(() -> new RuntimeException("Ligne introuvable"));  
          
        return ligneStationRepository.findByLigneOrderByOrdreAsc(ligne).stream()  
            .map(this::convertToLigneStationResponseDTO)  
            .collect(Collectors.toList());  
    }  
  
    /**  
     * Désactiver une ligne  
     */  
    public void desactiverLigne(UUID id) {  
        Ligne ligne = ligneRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ligne introuvable"));  
        ligne.setActive(false);  
        ligneRepository.save(ligne);  
    }  
  
    /**  
     * Activer une ligne  
     */  
    public void activerLigne(UUID id) {  
        Ligne ligne = ligneRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ligne introuvable"));  
        ligne.setActive(true);  
        ligneRepository.save(ligne);  
    }  
  
    /**  
     * Calculer la distance entre deux points GPS (formule de Haversine)  
     */  
    private double calculerDistance(double lat1, double lon1, double lat2, double lon2) {  
        final int R = 6371; // Rayon de la Terre en km  
  
        double latDistance = Math.toRadians(lat2 - lat1);  
        double lonDistance = Math.toRadians(lon2 - lon1);  
          
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)  
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))  
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);  
          
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));  
          
        return R * c; // Distance en kilomètres  
    }  
  
    /**  
     * Conversion Ligne -> DTO  
     */  
    private LigneResponseDTO convertToResponseDTO(Ligne ligne) {  
        LigneResponseDTO dto = new LigneResponseDTO();  
        dto.setId(ligne.getId());  
        dto.setNumero(ligne.getNumero());  
        dto.setNom(ligne.getNom());  
        dto.setPrixStandard(ligne.getPrixStandard());  
        dto.setVitesseStandardKmH(ligne.getVitesseStandardKmH());  
        dto.setActive(ligne.getActive());  
          
        // Charger les stations si nécessaire  
        List<LigneStation> ligneStations = ligneStationRepository.findByLigneOrderByOrdreAsc(ligne);  
        if (!ligneStations.isEmpty()) {  
            List<LigneStationResponseDTO> stationDTOs = ligneStations.stream()  
                .map(this::convertToLigneStationResponseDTO)  
                .collect(Collectors.toList());  
            dto.setStations(stationDTOs);  
        }  
          
        return dto;  
    }  
  
    /**  
     * Conversion LigneStation -> DTO  
     */  
    private LigneStationResponseDTO convertToLigneStationResponseDTO(LigneStation ligneStation) {  
        LigneStationResponseDTO dto = new LigneStationResponseDTO();  
        dto.setId(ligneStation.getId());  
        dto.setOrdre(ligneStation.getOrdre());  
        dto.setTempsArretMinutes(ligneStation.getTempsArretMinutes());  
        dto.setDistanceKmDepart(ligneStation.getDistanceKmDepart());  
          
        Station station = ligneStation.getStation();  
        StationSimpleDTO stationDTO = new StationSimpleDTO();  
        stationDTO.setId(station.getId());  
        stationDTO.setNom(station.getNom());  
        stationDTO.setLatitude(station.getLatitude());  
        stationDTO.setLongitude(station.getLongitude());  
          
        dto.setStation(stationDTO);  
        return dto;  
    }  
}