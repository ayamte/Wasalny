package com.wasalny.trajet.dto.request; 
  
import jakarta.validation.constraints.NotBlank;  
import jakarta.validation.constraints.NotNull;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class StationCreateDTO {  
      
    @NotBlank(message = "Le nom de la station est obligatoire")  
    private String nom;  
      
    @NotNull(message = "La latitude est obligatoire")  
    private Double latitude;  
      
    @NotNull(message = "La longitude est obligatoire")  
    private Double longitude;  
      
    private Integer capacite;  
}