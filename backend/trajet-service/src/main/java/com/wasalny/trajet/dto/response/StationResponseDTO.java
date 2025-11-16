package com.wasalny.trajet.dto.response;  
 
import com.wasalny.trajet.dto.simple.StationSimpleDTO;
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class StationResponseDTO {  
      
    private UUID id;  
    private String nom;  
    private Double latitude;  
    private Double longitude;  
    private Integer capacite;  
    private Boolean active;  
}