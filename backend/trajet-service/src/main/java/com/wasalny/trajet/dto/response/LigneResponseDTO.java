package com.wasalny.trajet.dto.response;  
  
import com.wasalny.trajet.dto.simple.StationSimpleDTO;  
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
    private Double distanceTotaleKm;  
    private Boolean active;  
      
    // Liste ordonnée des stations (départ, intermédiaires, arrivée)  
    private List<StationSimpleDTO> stations;  
}