package com.wasalny.trajet.dto.response; 
  
import com.wasalny.trajet.dto.simple.StationSimpleDTO;
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LigneStationResponseDTO {  
      
    private UUID id;  
    private Integer ordre;  
    private Integer tempsArretMinutes;  
    private Double distanceKmDepart;  
    private StationSimpleDTO station;  
}