package com.wasalny.paiement.dto;  
  
import com.wasalny.paiement.entity.StatutTransaction;  
import com.wasalny.paiement.entity.Transaction;  
import com.wasalny.paiement.entity.TypePaiement;  
import com.wasalny.paiement.entity.TypeService;  
import lombok.AllArgsConstructor;  
import lombok.Builder;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
import java.math.BigDecimal;  
import java.time.LocalDateTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
@Builder  
public class TransactionResponse {  
      
    private UUID id;  
    private String reference;  
    private UUID clientId;  
    private BigDecimal montant;  
    private String devise;  
    private TypePaiement typePaiement;  
    private StatutTransaction statut;  
    private LocalDateTime dateTransaction;  
    private TypeService typeService;  
    private UUID referenceService;  
    private String description;  
    private String motifEchec;  
    private LocalDateTime createdAt;  
      
    public static TransactionResponse fromEntity(Transaction transaction) {  
        return TransactionResponse.builder()  
            .id(transaction.getId())  
            .reference(transaction.getReference())  
            .clientId(transaction.getClientId())  
            .montant(transaction.getMontant())  
            .devise(transaction.getDevise())  
            .typePaiement(transaction.getTypePaiement())  
            .statut(transaction.getStatut())  
            .dateTransaction(transaction.getDateTransaction())  
            .typeService(transaction.getTypeService())  
            .referenceService(transaction.getReferenceService())  
            .description(transaction.getDescription())  
            .motifEchec(transaction.getMotifEchec())  
            .createdAt(transaction.getCreatedAt())  
            .build();  
    }  
}