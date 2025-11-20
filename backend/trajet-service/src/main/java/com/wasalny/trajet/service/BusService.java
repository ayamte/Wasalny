package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.request.BusCreateDTO;  
import com.wasalny.trajet.dto.response.BusResponseDTO;  
import com.wasalny.trajet.entity.Bus;  
import com.wasalny.trajet.repository.BusRepository;  
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
  
import java.math.BigDecimal;  
import java.util.List;  
import java.util.UUID;  
import java.util.stream.Collectors;  
  
@Service  
@Transactional  
@RequiredArgsConstructor  
public class BusService {  
      
    private final BusRepository busRepository;  
      
    /**  
     * Créer un nouveau bus  
     */  
    public BusResponseDTO creerBus(BusCreateDTO dto) {  
        // Vérifier unicité immatriculation  
        if (busRepository.findByNumeroImmatriculation(dto.getNumeroImmatriculation()).isPresent()) {  
            throw new IllegalArgumentException("Un bus avec cette immatriculation existe déjà");  
        }  
          
        Bus bus = new Bus();  
        bus.setNumeroImmatriculation(dto.getNumeroImmatriculation());  
        bus.setCapacite(dto.getCapacite());  
        bus.setModele(dto.getModele());  
        bus.setActive(true);  
        bus.setMetreAvantArret(BigDecimal.ZERO);  
          
        Bus saved = busRepository.save(bus);  
        return convertToResponseDTO(saved);  
    }  
      
    /**  
     * Obtenir tous les bus actifs  
     */  
    public List<BusResponseDTO> obtenirBusActifs() {  
        return busRepository.findByActiveTrue().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir un bus par ID  
     */  
    public BusResponseDTO obtenirBusParId(UUID id) {  
        Bus bus = busRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'ID: " + id));  
        return convertToResponseDTO(bus);  
    }  
      
    /**  
     * Obtenir un bus par numéro d'immatriculation  
     */  
    public BusResponseDTO obtenirBusParImmatriculation(String numeroImmatriculation) {  
        Bus bus = busRepository.findByNumeroImmatriculation(numeroImmatriculation)  
            .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'immatriculation: " + numeroImmatriculation));  
        return convertToResponseDTO(bus);  
    }  
      
    /**  
     * Désactiver un bus  
     */  
    public void desactiverBus(UUID id) {  
        Bus bus = busRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'ID: " + id));  
        bus.setActive(false);  
        busRepository.save(bus);  
    }  
      
    /**  
     * Activer un bus  
     */  
    public void activerBus(UUID id) {  
        Bus bus = busRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'ID: " + id));  
        bus.setActive(true);  
        busRepository.save(bus);  
    }  
      
    /**  
     * Obtenir l'entité Bus (pour usage interne)  
     */  
    public Bus obtenirBusEntity(UUID id) {  
        return busRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'ID: " + id));  
    }  
      
    /**  
     * Conversion entité -> DTO  
     */  
    private BusResponseDTO convertToResponseDTO(Bus bus) {  
        BusResponseDTO dto = new BusResponseDTO();  
        dto.setId(bus.getId());  
        dto.setNumeroImmatriculation(bus.getNumeroImmatriculation());  
        dto.setCapacite(bus.getCapacite());  
        dto.setModele(bus.getModele());  
        dto.setActive(bus.getActive());  
        dto.setLatitudeActuelle(bus.getLatitudeActuelle());  
        dto.setLongitudeActuelle(bus.getLongitudeActuelle());  
        dto.setMetreAvantArret(bus.getMetreAvantArret());  
        return dto;  
    }  
}