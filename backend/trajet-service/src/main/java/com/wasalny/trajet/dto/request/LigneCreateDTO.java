package com.wasalny.trajet.dto.request;  
  
import jakarta.validation.constraints.DecimalMin;  
import jakarta.validation.constraints.NotBlank;  
import jakarta.validation.constraints.NotNull;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.math.BigDecimal;  
import java.util.List;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LigneCreateDTO {  
      
    @NotBlank(message = "Le numéro de ligne est obligatoire")  
    private String numero;  
      
    @NotBlank(message = "Le nom de ligne est obligatoire")  
    private String nom;  
      
    @NotNull(message = "L'ID de la station de départ est obligatoire")  
    private UUID stationDepartId;  
      
    // Liste des stations intermédiaires (peut être vide)  
    private List<UUID> stationsIntermediairesIds;  
      
    @NotNull(message = "L'ID de la station d'arrivée est obligatoire")  
    private UUID stationArriveeId;  
      
    @NotNull(message = "Le prix standard est obligatoire")  
    @DecimalMin(value = "0.0", message = "Le prix doit être positif")  
    private BigDecimal prixStandard;  
      
    @NotNull(message = "La vitesse standard est obligatoire")  
    @DecimalMin(value = "0.0", message = "La vitesse doit être positive")  
    private Double vitesseStandardKmH;  
}