package com.wasalny.trajet.service;  
  
import com.wasalny.trajet.dto.request.AssignationBusConducteurCreateDTO;  
import com.wasalny.trajet.dto.response.AssignationBusConducteurResponseDTO;  
import com.wasalny.trajet.dto.simple.BusSimpleDTO;  
import com.wasalny.trajet.entity.AssignationBusConducteur;  
import com.wasalny.trajet.entity.Bus;  
import com.wasalny.trajet.repository.AssignationBusConducteurRepository;  
import com.wasalny.trajet.repository.BusRepository;  
import lombok.RequiredArgsConstructor;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
  
import java.time.LocalDate;  
import java.util.List;  
import java.util.UUID;  
import java.util.stream.Collectors;  
  
@Service  
@Transactional  
@RequiredArgsConstructor  
public class AssignationBusConducteurService {  
      
    private final AssignationBusConducteurRepository assignationRepository;  
    private final BusRepository busRepository;  
      
    /**  
     * Créer une nouvelle assignation bus-conducteur  
     */  
    public AssignationBusConducteurResponseDTO creerAssignation(AssignationBusConducteurCreateDTO dto) {  
        // Vérifier que le bus existe  
        Bus bus = busRepository.findById(dto.getBusId())  
            .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'ID: " + dto.getBusId()));  
          
        // Vérifier qu'il n'y a pas de chevauchement de dates pour ce bus  
        List<AssignationBusConducteur> assignationsExistantes =   
            assignationRepository.findActiveAssignationForBusAtDate(  
                dto.getBusId(),   
                dto.getDateDebut(),   
                dto.getDateFin()  
            );  
          
        if (!assignationsExistantes.isEmpty()) {  
            throw new RuntimeException("Le bus a déjà une assignation active durant cette période");  
        }  
          
        // Créer l'assignation  
        AssignationBusConducteur assignation = new AssignationBusConducteur();  
        assignation.setBus(bus);  
        assignation.setConducteurId(dto.getConducteurId());  
        assignation.setDateDebut(dto.getDateDebut());  
        assignation.setDateFin(dto.getDateFin());  
        assignation.setActive(true);  
          
        AssignationBusConducteur saved = assignationRepository.save(assignation);  
        return convertToResponseDTO(saved);  
    }  
      
    /**  
     * Obtenir une assignation par ID  
     */  
    public AssignationBusConducteurResponseDTO obtenirAssignationParId(UUID id) {  
        AssignationBusConducteur assignation = assignationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Assignation non trouvée avec l'ID: " + id));  
        return convertToResponseDTO(assignation);  
    }  
      
    /**  
     * Obtenir toutes les assignations  
     */  
    public List<AssignationBusConducteurResponseDTO> obtenirToutesLesAssignations() {  
        return assignationRepository.findAll().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir les assignations d'un bus  
     */  
    public List<AssignationBusConducteurResponseDTO> obtenirAssignationsDuBus(UUID busId) {  
        return assignationRepository.findByBusId(busId).stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir les assignations d'un conducteur  
     */  
    public List<AssignationBusConducteurResponseDTO> obtenirAssignationsDuConducteur(UUID conducteurId) {  
        return assignationRepository.findByConducteurId(conducteurId).stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Obtenir l'assignation active d'un bus à une date donnée  
     */  
    public AssignationBusConducteurResponseDTO obtenirAssignationActive(UUID busId, LocalDate date) {  
        List<AssignationBusConducteur> assignations =   
            assignationRepository.findActiveAssignationForBusAtDate(busId, date, date);  
          
        if (assignations.isEmpty()) {  
            throw new RuntimeException("Aucune assignation active trouvée pour ce bus à cette date");  
        }  
          
        return convertToResponseDTO(assignations.get(0));  
    }  
      
    /**  
     * Désactiver une assignation  
     */  
    public void desactiverAssignation(UUID id) {  
        AssignationBusConducteur assignation = assignationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Assignation non trouvée avec l'ID: " + id));  
        assignation.setActive(false);  
        assignationRepository.save(assignation);  
    }  
      
    /**  
     * Activer une assignation  
     */  
    public void activerAssignation(UUID id) {  
        AssignationBusConducteur assignation = assignationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Assignation non trouvée avec l'ID: " + id));  
        assignation.setActive(true);  
        assignationRepository.save(assignation);  
    }  
      
    /**  
     * Supprimer une assignation  
     */  
    public void supprimerAssignation(UUID id) {  
        if (!assignationRepository.existsById(id)) {  
            throw new RuntimeException("Assignation non trouvée avec l'ID: " + id);  
        }  
        assignationRepository.deleteById(id);  
    }  
      
    /**  
     * Obtenir les assignations actives  
     */  
    public List<AssignationBusConducteurResponseDTO> obtenirAssignationsActives() {  
        return assignationRepository.findByActiveTrue().stream()  
            .map(this::convertToResponseDTO)  
            .collect(Collectors.toList());  
    }  
      
    /**  
     * Vérifier si un bus a une assignation active  
     */  
    public boolean busAAssignationActive(UUID busId, LocalDate date) {  
        List<AssignationBusConducteur> assignations =   
            assignationRepository.findActiveAssignationForBusAtDate(busId, date, date);  
        return !assignations.isEmpty();  
    }  
      
    /**  
     * Conversion entité -> DTO  
     */  
    private AssignationBusConducteurResponseDTO convertToResponseDTO(AssignationBusConducteur assignation) {  
        AssignationBusConducteurResponseDTO dto = new AssignationBusConducteurResponseDTO();  
        dto.setId(assignation.getId());  
        dto.setConducteurId(assignation.getConducteurId());  
        dto.setDateDebut(assignation.getDateDebut());  
        dto.setDateFin(assignation.getDateFin());  
        dto.setActive(assignation.getActive());  
          
        // Bus simplifié  
        Bus bus = assignation.getBus();  
        BusSimpleDTO busDTO = new BusSimpleDTO();  
        busDTO.setId(bus.getId());  
        busDTO.setNumeroImmatriculation(bus.getNumeroImmatriculation());  
        busDTO.setCapacite(bus.getCapacite());  
        busDTO.setModele(bus.getModele());  
        dto.setBus(busDTO);  
          
        return dto;  
    }  
}