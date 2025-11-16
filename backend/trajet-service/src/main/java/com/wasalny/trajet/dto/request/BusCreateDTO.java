package com.wasalny.trajet.dto.request;
  
import jakarta.validation.constraints.Min;  
import jakarta.validation.constraints.NotBlank;  
import jakarta.validation.constraints.NotNull;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class BusCreateDTO {  
      
    @NotBlank(message = "Le numéro d'immatriculation est obligatoire")  
    private String numeroImmatriculation;  
      
    @NotNull(message = "La capacité est obligatoire")  
    @Min(value = 1, message = "La capacité doit être au moins 1")  
    private Integer capacite;  
      
    @NotBlank(message = "Le modèle est obligatoire")  
    private String modele;  
}