package com.wasalny.trajet.dto.request; 
  
import jakarta.validation.constraints.Min;  
import jakarta.validation.constraints.NotNull;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LigneStationCreateDTO {  
      
    @NotNull(message = "L'ID de la ligne est obligatoire")  
    private UUID ligneId;  
      
    @NotNull(message = "L'ID de la station est obligatoire")  
    private UUID stationId;  
      
    @NotNull(message = "L'ordre est obligatoire")  
    @Min(value = 0, message = "L'ordre doit être >= 0")  
    private Integer ordre;  
      
    @NotNull(message = "Le temps d'arrêt est obligatoire")  
    @Min(value = 0, message = "Le temps d'arrêt doit être >= 0")  
    private Integer tempsArretMinutes;  
      
    @NotNull(message = "La distance depuis le départ est obligatoire")  
    @Min(value = 0, message = "La distance doit être >= 0")  
    private Double distanceKmDepart;  
}