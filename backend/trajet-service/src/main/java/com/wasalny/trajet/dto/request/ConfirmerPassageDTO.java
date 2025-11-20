package com.wasalny.trajet.dto.request; 
  
import jakarta.validation.constraints.NotNull;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class ConfirmerPassageDTO {  
      
    @NotNull(message = "L'ID de la station est obligatoire")  
    private UUID stationId;  
      
    @NotNull(message = "L'heure réelle est obligatoire")  
    private LocalTime heureReelle;  
}