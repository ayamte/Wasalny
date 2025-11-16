package com.wasalny.trajet.dto.simple; 
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class StationSimpleDTO {  
      
    private UUID id;  
    private String nom;  
    private Double latitude;  
    private Double longitude;  
}