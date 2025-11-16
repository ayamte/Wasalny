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
     * Créer une nouvelle ligne  
     */  
    public LigneResponseDTO creerLigne(LigneCreateDTO dto) {  
        // Vérifier unicité du numéro  
        if (ligneRepository.findByNumero(dto.getNumero()).isPresent()) {  
            throw new IllegalArgumentException("Une ligne avec ce numéro existe déjà");  
        }  
          
        Ligne ligne = new Ligne();  
        ligne.setNumero(dto.getNumero());  
        ligne.setNom(dto.getNom());  
        ligne.setPrixStandard(dto.getPrixStandard());  
        ligne.setVitesseStandardKmH(dto.getVitesseStandardKmH());  
        ligne.setActive(true);  
          
        Ligne saved = ligneRepository.save(ligne);  
        return convertToResponseDTO(saved);  
    }  
      
    /**  
     * Ajouter une station à une ligne  
     */  
    public LigneStationResponseDTO ajouterStationALigne(LigneStationCreateDTO dto) {  
        Ligne ligne = ligneRepository.findById(dto.getLigneId())  
            .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + dto.getLigneId()));  
          
        Station station = stationRepository.findById(dto.getStationId())  
            .orElseThrow(() -> new RuntimeException("Station non trouvée avec l'ID: " + dto.getStationId()));  
          
        LigneStation ligneStation = new LigneStation();  
        ligneStation.setLigne(ligne);  
        ligneStation.setStation(station);  
        ligneStation.setOrdre(dto.getOrdre());  
        ligneStation.setTempsArretMinutes(dto.getTempsArretMinutes());  
        ligneStation.setDistanceKmDepart(dto.getDistanceKmDepart());  
          
        LigneStation saved = ligneStationRepository.save(ligneStation);  
        return convertLigneStationToDTO(saved);  
    }  
      
    /**  
     * Obtenir toutes les lignes actives  
     */  
    public List<LigneResponseDTO> obtenirLignesActives() {  
        return ligneRepository.findByActiveTrue().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir une ligne par ID avec ses stations  
     */  
    public LigneResponseDTO obtenirLigneParId(UUID id) {  
        Ligne ligne = ligneRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + id));  
          
        LigneResponseDTO dto = convertToResponseDTO(ligne);  
          
        // Charger les stations de la ligne  
        List<LigneStation> ligneStations = ligneStationRepository.findByLigneIdOrderByOrdreAsc(id);  
        dto.setStations(ligneStations.stream()  
            .map(this::convertLigneStationToDTO)  
            .collect(Collectors.toList()));  
          
        return dto;  
    }  
      
    /**  
     * Obtenir les stations d'une ligne dans l'ordre  
     */  
    public List<LigneStationResponseDTO> obtenirStationsDeLigne(UUID ligneId) {  
        return ligneStationRepository.findByLigneIdOrderByOrdreAsc(ligneId).stream()  
            .map(this::convertLigneStationToDTO)  
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
     * Obtenir l'entité Ligne (pour usage interne)  
     */  
    public Ligne obtenirLigneEntity(UUID id) {  
        return ligneRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ligne non trouvée avec l'ID: " + id));  
    }  
      
    /**  
     * Conversion entité Ligne -> DTO  
     */  
    private LigneResponseDTO convertToResponseDTO(Ligne ligne) {  
        LigneResponseDTO dto = new LigneResponseDTO();  
        dto.setId(ligne.getId());  
        dto.setNumero(ligne.getNumero());  
        dto.setNom(ligne.getNom());  
        dto.setPrixStandard(ligne.getPrixStandard());  
        dto.setVitesseStandardKmH(ligne.getVitesseStandardKmH());  
        dto.setActive(ligne.getActive());  
        return dto;  
    }  
      
    /**  
     * Conversion entité LigneStation -> DTO  
     */  
    private LigneStationResponseDTO convertLigneStationToDTO(LigneStation ligneStation) {  
        LigneStationResponseDTO dto = new LigneStationResponseDTO();  
        dto.setId(ligneStation.getId());  
        dto.setOrdre(ligneStation.getOrdre());  
        dto.setTempsArretMinutes(ligneStation.getTempsArretMinutes());  
        dto.setDistanceKmDepart(ligneStation.getDistanceKmDepart());  
          
        // Convertir la station en DTO simplifié  
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