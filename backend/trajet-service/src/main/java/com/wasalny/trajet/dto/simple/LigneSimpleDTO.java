package com.wasalny.trajet.dto.simple; 
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.math.BigDecimal;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LigneSimpleDTO {  
      
    private UUID id;  
    private String numero;  
    private String nom;  
    private BigDecimal prixStandard;  
}