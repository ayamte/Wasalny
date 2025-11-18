package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.request.StationCreateDTO;  
import com.wasalny.trajet.dto.response.StationResponseDTO;  
import com.wasalny.trajet.entity.Station;  
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
public class StationService {  
      
    private final StationRepository stationRepository;  
      
    /**  
     * Créer une nouvelle station  
     */  
    public StationResponseDTO creerStation(StationCreateDTO dto) {  
        // Vérifier unicité du nom  
        if (stationRepository.findByNom(dto.getNom()).isPresent()) {  
            throw new IllegalArgumentException("Une station avec ce nom existe déjà");  
        }  
          
        Station station = new Station();  
        station.setNom(dto.getNom());  
        station.setLatitude(dto.getLatitude());  
        station.setLongitude(dto.getLongitude());  
        station.setCapacite(dto.getCapacite());  
        station.setActive(true);  
          
        Station saved = stationRepository.save(station);  
        return convertToResponseDTO(saved);  
    }  
      
    /**  
     * Obtenir toutes les stations actives  
     */  
    public List<StationResponseDTO> obtenirStationsActives() {  
        return stationRepository.findByActiveTrue().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir une station par ID  
     */  
    public StationResponseDTO obtenirStationParId(UUID id) {  
        Station station = stationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Station non trouvée avec l'ID: " + id));  
        return convertToResponseDTO(station);  
    }  
      
    /**  
     * Obtenir une station par nom  
     */  
    public StationResponseDTO obtenirStationParNom(String nom) {  
        Station station = stationRepository.findByNom(nom)  
            .orElseThrow(() -> new RuntimeException("Station non trouvée avec le nom: " + nom));  
        return convertToResponseDTO(station);  
    }  
      
    /**  
     * Désactiver une station  
     */  
    public void desactiverStation(UUID id) {  
        Station station = stationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Station non trouvée avec l'ID: " + id));  
        station.setActive(false);  
        stationRepository.save(station);  
    }  
      
    /**  
     * Activer une station  
     */  
    public void activerStation(UUID id) {  
        Station station = stationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Station non trouvée avec l'ID: " + id));  
        station.setActive(true);  
        stationRepository.save(station);  
    }  
      
    /**  
     * Obtenir l'entité Station (pour usage interne)  
     */  
    public Station obtenirStationEntity(UUID id) {  
        return stationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Station non trouvée avec l'ID: " + id));  
    }  
      
    /**  
     * Conversion entité -> DTO  
     */  
    private StationResponseDTO convertToResponseDTO(Station station) {  
        StationResponseDTO dto = new StationResponseDTO();  
        dto.setId(station.getId());  
        dto.setNom(station.getNom());  
        dto.setLatitude(station.getLatitude());  
        dto.setLongitude(station.getLongitude());  
        dto.setCapacite(station.getCapacite());  
        dto.setActive(station.getActive());  
        return dto;  
    }  
}