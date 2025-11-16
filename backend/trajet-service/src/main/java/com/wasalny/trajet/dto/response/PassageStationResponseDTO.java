package com.wasalny.trajet.dto.response;   

import com.wasalny.trajet.dto.simple.StationSimpleDTO;
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class PassageStationResponseDTO {  
      
    private UUID id;  
    private Integer ordre;  
    private LocalTime heurePrevu;  
    private LocalTime heureReelle;  
    private LocalTime heureEstimee;  
    private Integer retardMinutes;  
    private Boolean confirme;  
    private StationSimpleDTO station;  
}