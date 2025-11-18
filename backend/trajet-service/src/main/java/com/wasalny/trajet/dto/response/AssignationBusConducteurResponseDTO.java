package com.wasalny.trajet.dto.response;  

import com.wasalny.trajet.dto.simple.BusSimpleDTO;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalDate;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class AssignationBusConducteurResponseDTO {  
      
    private UUID id;  
    private UUID conducteurId;  
    private LocalDate dateDebut;  
    private LocalDate dateFin;  
    private Boolean active;  
    private BusSimpleDTO bus;  
}