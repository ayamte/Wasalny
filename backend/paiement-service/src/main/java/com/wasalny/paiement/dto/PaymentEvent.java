package com.wasalny.paiement.dto;  
  
import com.wasalny.paiement.entity.TypeService;  
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
    private TypeService typeService;  
    private UUID referenceService;  
    private LocalDateTime dateTransaction;  
    private String statut;  
    private String motifEchec;  
}