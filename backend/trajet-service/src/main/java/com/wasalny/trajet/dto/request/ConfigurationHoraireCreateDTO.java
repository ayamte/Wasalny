package com.wasalny.trajet.dto.request;  
  
import jakarta.validation.constraints.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.time.LocalTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class ConfigurationHoraireCreateDTO {  
      
    @NotNull(message = "L'ID de la ligne est obligatoire")  
    private UUID ligneId;  
      
    @NotNull(message = "L'heure de début est obligatoire")  
    private LocalTime heureDebut;  
      
    @NotNull(message = "L'heure de fin est obligatoire")  
    private LocalTime heureFin;  
      
    @NotNull(message = "La fréquence est obligatoire")  
    @Min(value = 1, message = "La fréquence doit être au moins 1 minute")  
    private Integer frequenceMinutes;  
      
    @NotNull(message = "Le nombre de bus est obligatoire")  
    @Min(value = 1, message = "Il faut au moins 1 bus")  
    private Integer nombreBus;  
      
    @NotNull(message = "Le temps d'arrêt est obligatoire")  
    @Min(value = 0, message = "Le temps d'arrêt ne peut pas être négatif")  
    private Integer tempsArretMinutes;  
      
    @NotNull(message = "Le temps de pause est obligatoire")  
    @Min(value = 0, message = "Le temps de pause ne peut pas être négatif")  
    private Integer tempsPauseMinutes;  
      
    // AJOUTEZ CES DEUX ATTRIBUTS  
    @NotNull(message = "La durée aller est obligatoire")  
    @Min(value = 1, message = "La durée aller doit être au moins 1 minute")  
    private Integer dureeAllerMinutes;  
      
    @NotNull(message = "La durée retour est obligatoire")  
    @Min(value = 1, message = "La durée retour doit être au moins 1 minute")  
    private Integer dureeRetourMinutes;  
}