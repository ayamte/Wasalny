package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.response.PassageStationResponseDTO;  
import com.wasalny.trajet.dto.simple.StationSimpleDTO;  
import com.wasalny.trajet.entity.PassageStation;  
import com.wasalny.trajet.entity.Station;  
import com.wasalny.trajet.repository.PassageStationRepository;  
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
  
import java.time.LocalTime;  
import java.util.List;  
import java.util.UUID;  
import java.util.stream.Collectors;  
  
@Service  
@Transactional  
@RequiredArgsConstructor  
public class PassageStationService {  
      
    private final PassageStationRepository passageStationRepository;  
      
    /**  
     * Confirmer un passage à une station  
     * Calcule automatiquement le retard  
     */  
    public PassageStationResponseDTO confirmerPassage(UUID passageId, LocalTime heureReelle) {  
        PassageStation passage = passageStationRepository.findById(passageId)  
            .orElseThrow(() -> new RuntimeException("Passage non trouvé avec l'ID: " + passageId));  
          
        // Utilise la méthode métier de l'entité  
        passage.confirmer(heureReelle);  
          
        PassageStation saved = passageStationRepository.save(passage);  
        return convertToResponseDTO(saved);  
    }  
      
    /**  
     * Propager le retard aux stations suivantes d'un trip  
     */  
    public void propagerRetard(UUID tripId, Integer retardMinutes) {  
        List<PassageStation> passages = passageStationRepository.findNonConfirmesByTrip(tripId);  
          
        for (PassageStation passage : passages) {  
            passage.setRetardMinutes(retardMinutes);  
            passageStationRepository.save(passage);  
        }  
    }  
      
    /**  
     * Obtenir l'heure estimée d'arrivée à une station  
     */  
    public LocalTime obtenirHeureEstimee(UUID passageId) {  
        PassageStation passage = passageStationRepository.findById(passageId)  
            .orElseThrow(() -> new RuntimeException("Passage non trouvé avec l'ID: " + passageId));  
          
        return passage.obtenirHeureEstimee();  
    }  
      
    /**  
     * Obtenir tous les passages d'un trip  
     */  
    public List<PassageStationResponseDTO> obtenirPassagesDuTrip(UUID tripId) {  
        return passageStationRepository.findByTripIdOrderByOrdreAsc(tripId).stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir les passages non confirmés d'un trip  
     */  
    public List<PassageStationResponseDTO> obtenirPassagesNonConfirmes(UUID tripId) {  
        return passageStationRepository.findNonConfirmesByTrip(tripId).stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Calculer le retard d'un passage  
     */  
    public Integer calculerRetard(UUID passageId) {  
        PassageStation passage = passageStationRepository.findById(passageId)  
            .orElseThrow(() -> new RuntimeException("Passage non trouvé avec l'ID: " + passageId));  
          
        return passage.calculerRetard();  
    }  
      
    /**  
     * Obtenir le prochain passage non confirmé d'un trip  
     */  
    public PassageStationResponseDTO obtenirProchainPassageNonConfirme(UUID tripId) {  
        List<PassageStation> passages = passageStationRepository.findNonConfirmesByTrip(tripId);  
          
        if (passages.isEmpty()) {  
            throw new RuntimeException("Aucun passage non confirmé pour ce trip");  
        }  
          
        // Le premier passage non confirmé est le prochain  
        return convertToResponseDTO(passages.get(0));  
    }  
      
    /**  
     * Conversion entité -> DTO  
     */  
    private PassageStationResponseDTO convertToResponseDTO(PassageStation passage) {  
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