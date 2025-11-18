package com.wasalny.trajet.dto.simple;
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class BusSimpleDTO {  
      
    private UUID id;  
    private String numeroImmatriculation;  
    private Integer capacite;  
    private String modele;  
}