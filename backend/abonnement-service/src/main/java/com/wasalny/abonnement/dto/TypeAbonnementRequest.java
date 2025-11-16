package com.wasalny.abonnement.dto;  
  
import jakarta.validation.Valid;  
import jakarta.validation.constraints.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.util.List;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class TypeAbonnementRequest {  
      
    @NotBlank(message = "Le code est obligatoire")  
    private String code;  
      
    @NotBlank(message = "Le nom est obligatoire")  
    private String nom;  
      
    private String description;  
      
    @NotNull(message = "Le prix est obligatoire")  
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être positif")  
    private BigDecimal prix;  
      
    @NotNull(message = "La durée est obligatoire")  
    @Min(value = 1, message = "La durée doit être au moins 1 jour")  
    private Integer dureeJours;  
      
    private Boolean actif = true;  
      
    @Valid  
    private List<LigneAutoriseeRequest> lignesAutorisees;  
      
    // Classe interne pour mapper les lignes autorisées  
    @Data  
    @NoArgsConstructor  
    @AllArgsConstructor  
    public static class LigneAutoriseeRequest {  
        @NotNull(message = "L'ID de la ligne est obligatoire")  
        private UUID ligneId;  
          
        @NotBlank(message = "Le nom de la ligne est obligatoire")  
        private String nomLigne;  
    }  
}