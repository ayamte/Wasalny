package com.wasalny.paiement.dto;  
  
import com.wasalny.paiement.entity.InfoPaiementCarte;  
import com.wasalny.paiement.entity.TypePaiement;  
import com.wasalny.paiement.entity.TypeService;  
import jakarta.validation.Valid;  
import jakarta.validation.constraints.NotNull;  
import jakarta.validation.constraints.Positive;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.math.BigDecimal;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class InitierPaiementRequest {  
      
    @NotNull(message = "L'ID du client est obligatoire")  
    private UUID clientId;  
      
    @NotNull(message = "Le montant est obligatoire")  
    @Positive(message = "Le montant doit être positif")  
    private BigDecimal montant;  
      
    private TypePaiement typePaiement;  
      
    @NotNull(message = "Le type de service est obligatoire")  
    private TypeService typeService;  
      
    @NotNull(message = "La référence du service est obligatoire")  
    private UUID referenceService;  
      
    private String description;  
      
    @Valid  
    private InfoPaiementCarte infoCarte;  
}