package com.wasalny.trajet.dto.request; 
  
import jakarta.validation.constraints.NotNull;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalDate;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class AssignationBusConducteurCreateDTO {  
      
    @NotNull(message = "L'ID du bus est obligatoire")  
    private UUID busId;  
      
    @NotNull(message = "L'ID du conducteur est obligatoire")  
    private UUID conducteurId;  
      
    @NotNull(message = "La date de début est obligatoire")  
    private LocalDate dateDebut;  
      
    @NotNull(message = "La date de fin est obligatoire")  
    private LocalDate dateFin;  
}