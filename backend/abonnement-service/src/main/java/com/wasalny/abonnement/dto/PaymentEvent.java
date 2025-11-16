package com.wasalny.abonnement.dto;  
  
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.time.LocalDateTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class PaymentEvent {  
    private UUID transactionId;  
    private String reference;  
    private UUID clientId;  
    private BigDecimal montant;  
    private String typeService;  
    private UUID referenceService;  
    private LocalDateTime dateTransaction;  
    private String statut;  
    private String motifEchec;  
}