package com.wasalny.trajet.dto.request;  
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LocationDTO {  
    private UUID busId;  
    private Double latitude;  
    private Double longitude;  
}