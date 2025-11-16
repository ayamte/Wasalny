package com.wasalny.abonnement.dto;  
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.time.LocalDate;  
import java.time.LocalDateTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class AbonnementEvent {  
    private UUID abonnementId;  
    private String numeroAbonnement;  
    private UUID clientId;  
    private UUID typeAbonnementId;  
    private String nomTypeAbonnement;  
    private LocalDate dateDebut;  
    private LocalDate dateFin;  
    private BigDecimal montantPaye;  
    private LocalDateTime dateCreation;  
}