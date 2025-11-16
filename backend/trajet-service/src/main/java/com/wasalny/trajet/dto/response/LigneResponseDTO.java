package com.wasalny.trajet.dto.response; 
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.math.BigDecimal;  
import java.util.List;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LigneResponseDTO {  
      
    private UUID id;  
    private String numero;  
    private String nom;  
    private BigDecimal prixStandard;  
    private Double vitesseStandardKmH;  
    private Boolean active;  
    private List<LigneStationResponseDTO> stations;  
}