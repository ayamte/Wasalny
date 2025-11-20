package com.wasalny.trajet.dto.response; 
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.math.BigDecimal;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class BusResponseDTO {  
      
    private UUID id;  
    private String numeroImmatriculation;  
    private Integer capacite;  
    private String modele;  
    private Boolean active;  
    private Double latitudeActuelle;  
    private Double longitudeActuelle;  
    private BigDecimal metreAvantArret;  
}