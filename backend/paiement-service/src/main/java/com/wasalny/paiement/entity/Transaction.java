package com.wasalny.paiement.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.time.LocalDateTime;  
import java.util.UUID;  
  
@Entity  
@Table(name = "transactions")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Transaction {  
      
    @Id  
    @GeneratedValue(strategy = GenerationType.UUID)  
    private UUID id;  
      
    @Column(nullable = false, unique = true)  
    private String reference;  
      
    @Column(nullable = false)  
    private UUID clientId;  
      
    @Column(nullable = false, precision = 10, scale = 2)  
    private BigDecimal montant;  
      
    @Column(nullable = false, length = 3)  
    private String devise = "MAD";  
      
    @Enumerated(EnumType.STRING)  
    @Column(nullable = false)  
    private TypePaiement typePaiement = TypePaiement.CARTE_BANCAIRE;  
      
    @Enumerated(EnumType.STRING)  
    @Column(nullable = false)  
    private StatutTransaction statut;  
      
    @Column(nullable = false)  
    private LocalDateTime dateTransaction;  
      
    @Enumerated(EnumType.STRING)  
    @Column(nullable = false)  
    private TypeService typeService;  
      
    @Column(nullable = false)  
    private UUID referenceService;  // dans ticket doit etre id du trajet  mais dans abonnement doit etre id du type d'abonnement
      
    private String description;  
    private String motifEchec;  
      
    @Embedded  
    private InfoPaiementCarte infoCarte;  
      
    @Column(nullable = false, updatable = false)  
    private LocalDateTime createdAt;  
      
    private LocalDateTime updatedAt;  
      
    @PrePersist  
    protected void onCreate() {  
        createdAt = LocalDateTime.now();  
        dateTransaction = LocalDateTime.now();  
        reference = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();  
    }  
      
    @PreUpdate  
    protected void onUpdate() {  
        updatedAt = LocalDateTime.now();  
    }  
}