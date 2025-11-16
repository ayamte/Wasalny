package com.wasalny.trajet.dto.response;  
  
import com.wasalny.trajet.dto.simple.LigneSimpleDTO;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class ConfigurationHoraireResponseDTO {  
      
    private UUID id;  
    private LocalTime heureDebut;  
    private LocalTime heureFin;  
    private Integer frequenceMinutes;  
    private Integer dureeAllerMinutes;      // ✅ Ajouté  
    private Integer dureeRetourMinutes;     // ✅ Ajouté  
    private Integer tempsPauseMinutes;  
    private Integer tempsArretMinutes;  
    private Integer nombreBus;  
    private Boolean active;  
    private LigneSimpleDTO ligne;  
}