package com.wasalny.trajet.dto.response;  

import com.wasalny.trajet.dto.simple.BusSimpleDTO; 
import com.wasalny.trajet.dto.simple.LigneSimpleDTO;  
import com.wasalny.trajet.entity.StatutTrip;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalDate;  
import java.time.LocalTime;  
import java.util.List;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class TripResponseDTO {  
      
    private UUID id;  
    private String numeroTrip;  
    private LocalDate dateTrip;  
    private LocalTime heureDepart;  
    private Boolean estAller;  
    private StatutTrip statut;  
    private Integer ticketsVendus;  
    private Integer placesDisponibles;  
    private BusSimpleDTO bus;  
    private LigneSimpleDTO ligne;  
    private List<PassageStationResponseDTO> passages;  
}