package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.request.LigneCreateDTO;  
import com.wasalny.trajet.dto.response.LigneResponseDTO;  
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
  
import java.util.ArrayList;  
import java.util.List;  
import java.util.UUID;  
import java.util.stream.Collectors;  
  
@Service  
@RequiredArgsConstructor  
@Transactional  
public class LigneService {  
      
    private final LigneRepository ligneRepository;  
    private final StationRepository stationRepository;  
    private final LigneStationRepository ligneStationRepository;  
      
    /**  
     * Créer une nouvelle ligne avec stations intermédiaires  
     */  
    public LigneResponseDTO creerLigne(LigneCreateDTO dto) {  
        // Vérifier que le numéro de ligne n'existe pas déjà  
        if (ligneRepository.existsByNumero(dto.getNumero())) {  
            throw new RuntimeException("Une ligne avec ce numéro existe déjà: " + dto.getNumero());  
        }  
          
        // Récupérer toutes les stations  
        Station stationDepart = stationRepository.findById(dto.getStationDepartId())  
                .orElseThrow(() -> new RuntimeException("Station de départ non trouvée: " + dto.getStationDepartId()));  
          
        Station stationArrivee = stationRepository.findById(dto.getStationArriveeId())  
                .orElseThrow(() -> new RuntimeException("Station d'arrivée non trouvée: " + dto.getStationArriveeId()));  
          
        List<Station> stationsIntermediaires = new ArrayList<>();  
        if (dto.getStationsIntermediairesIds() != null && !dto.getStationsIntermediairesIds().isEmpty()) {  
            for (UUID stationId : dto.getStationsIntermediairesIds()) {  
                Station station = stationRepository.findById(stationId)  
                        .orElseThrow(() -> new RuntimeException("Station intermédiaire non trouvée: " + stationId));  
                stationsIntermediaires.add(station);  
            }  
        }  
          
        // Créer la ligne  
        Ligne ligne = new Ligne();  
        ligne.setNumero(dto.getNumero());  
        ligne.setNom(dto.getNom());  
        ligne.setPrixStandard(dto.getPrixStandard());  
        ligne.setVitesseStandardKmH(dto.getVitesseStandardKmH());  
        ligne.setActive(true);  
          
        Ligne savedLigne = ligneRepository.save(ligne);  
          
        // Créer les relations LigneStation avec calcul des distances  
        List<LigneStation> ligneStations = new ArrayList<>();  
        double distanceCumulee = 0.0;  
          
        // 1. Station de départ (ordre 0)  
        LigneStation ligneStationDepart = new LigneStation();  
        ligneStationDepart.setLigne(savedLigne);  
        ligneStationDepart.setStation(stationDepart);  
        ligneStationDepart.setOrdre(0);  
        ligneStationDepart.setDistanceCumuleeKm(0.0);  
        ligneStations.add(ligneStationDepart);  
          
        Station stationPrecedente = stationDepart;  
          
        // 2. Stations intermédiaires (ordre 1, 2, 3, ...)  
        for (int i = 0; i < stationsIntermediaires.size(); i++) {  
            Station stationCourante = stationsIntermediaires.get(i);  
              
            // Calculer la distance depuis la station précédente  
            double distance = calculerDistance(  
                    stationPrecedente.getLatitude(),  
                    stationPrecedente.getLongitude(),  
                    stationCourante.getLatitude(),  
                    stationCourante.getLongitude()  
            );  
            distanceCumulee += distance;  
              
            LigneStation ligneStation = new LigneStation();  
            ligneStation.setLigne(savedLigne);  
            ligneStation.setStation(stationCourante);  
            ligneStation.setOrdre(i + 1);  
            ligneStation.setDistanceCumuleeKm(distanceCumulee);  
            ligneStations.add(ligneStation);  
              
            stationPrecedente = stationCourante;  
        }  
          
        // 3. Station d'arrivée (dernier ordre)  
        double distanceFinale = calculerDistance(  
                stationPrecedente.getLatitude(),  
                stationPrecedente.getLongitude(),  
                stationArrivee.getLatitude(),  
                stationArrivee.getLongitude()  
        );  
        distanceCumulee += distanceFinale;  
          
        LigneStation ligneStationArrivee = new LigneStation();  
        ligneStationArrivee.setLigne(savedLigne);  
        ligneStationArrivee.setStation(stationArrivee);  
        ligneStationArrivee.setOrdre(stationsIntermediaires.size() + 1);  
        ligneStationArrivee.setDistanceCumuleeKm(distanceCumulee);  
        ligneStations.add(ligneStationArrivee);  
          
        // Sauvegarder toutes les relations  
        ligneStationRepository.saveAll(ligneStations);  
          
        // Mettre à jour la distance totale de la ligne  
        savedLigne.setDistanceTotaleKm(distanceCumulee);  
        ligneRepository.save(savedLigne);  
          
        return convertToResponseDTO(savedLigne);  
    }  
      
    /**  
     * Obtenir une ligne par son ID  
     */  
    public LigneResponseDTO obtenirLigneParId(UUID id) {  
        Ligne ligne = ligneRepository.findById(id)  
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + id));  
        return convertToResponseDTO(ligne);  
    }  
      
    /**  
     * Lister toutes les lignes (actives et inactives)  
     */  
    public List<LigneResponseDTO> listerToutesLesLignes() {  
        return ligneRepository.findAll()  
                .stream()  
                .map(this::convertToResponseDTO)  
                .collect(Collectors.toList());  
    }  
      
    /**  
     * Lister toutes les lignes actives  
     */  
    public List<LigneResponseDTO> listerLignesActives() {  
        return ligneRepository.findByActiveTrue()  
                .stream()  
                .map(this::convertToResponseDTO)  
                .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir les stations d'une ligne dans l'ordre  
     */  
    public List<StationSimpleDTO> obtenirStationsDeLigne(UUID ligneId) {  
        List<LigneStation> ligneStations = ligneStationRepository  
                .findByLigneIdOrderByOrdreAsc(ligneId);  
          
        return ligneStations.stream()  
                .map(ls -> {  
                    Station station = ls.getStation();  
                    StationSimpleDTO dto = new StationSimpleDTO();  
                    dto.setId(station.getId());  
                    dto.setNom(station.getNom());  
                    dto.setLatitude(station.getLatitude());  
                    dto.setLongitude(station.getLongitude());  
                    return dto;  
                })  
                .collect(Collectors.toList());  
    }  
      
    /**  
     * Désactiver une ligne  
     */  
    public void desactiverLigne(UUID id) {  
        Ligne ligne = ligneRepository.findById(id)  
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + id));  
        ligne.setActive(false);  
        ligneRepository.save(ligne);  
    }  
      
    /**  
     * Activer une ligne  
     */  
    public void activerLigne(UUID id) {  
        Ligne ligne = ligneRepository.findById(id)  
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + id));  
        ligne.setActive(true);  
        ligneRepository.save(ligne);  
    }  
      
    /**  
     * Calculer la distance entre deux points GPS (formule de Haversine)  
     */  
    private double calculerDistance(Double lat1, Double lon1, Double lat2, Double lon2) {  
        final int R = 6371; // Rayon de la Terre en kilomètres  
          
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
        dto.setDistanceTotaleKm(ligne.getDistanceTotaleKm());  
        dto.setActive(ligne.getActive());  
          
        // Récupérer les stations dans l'ordre  
        List<StationSimpleDTO> stations = obtenirStationsDeLigne(ligne.getId());  
        dto.setStations(stations);  
          
        return dto;  
    }  
}