package com.wasalny.abonnement.entity;  
  
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;  
  
@Entity  
@Table(name = "abonnement")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Abonnement {  
      
    @Id  
    @GeneratedValue(strategy = GenerationType.UUID)  
    private UUID id;  
      
    @Column(nullable = false, unique = true, length = 50)  
    private String numeroAbonnement;  
      
    @Column(nullable = false)  
    private UUID clientId;  
      
    @ManyToOne(fetch = FetchType.EAGER)  
    @JoinColumn(name = "type_abonnement_id", nullable = false)  
    private TypeAbonnement typeAbonnement;  
      
    @Column(nullable = false)  
    private LocalDate dateDebut;  
      
    @Column(nullable = false)  
    private LocalDate dateFin;  
      
    @Column(nullable = false)  
    private LocalDateTime dateAchat;  
      
    @Enumerated(EnumType.STRING)  
    @Column(nullable = false, length = 20)  
    private StatutAbonnement statut;  
      
    @Column(nullable = false, precision = 10, scale = 2)  
    private BigDecimal montantPaye;  
      
    @Column(nullable = false)
    private UUID transactionId;

    @Column(name = "lignes_autorisees", columnDefinition = "TEXT")
    @Convert(converter = UuidListConverter.class)
    private List<UUID> lignesAutorisees;

    @Column(name = "zone_geographique", length = 100)
    private String zoneGeographique;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  
      
    // Méthodes métier  
    public boolean estValide() {  
        return statut == StatutAbonnement.ACTIF &&   
               !LocalDate.now().isAfter(dateFin);  
    }  
      
    public boolean estExpire() {  
        return LocalDate.now().isAfter(dateFin);  
    }  
      
    public boolean peutUtiliserLigne(UUID ligneId) {  
        if (!estValide()) {  
            return false;  
        }  
        return typeAbonnement.verifierLigneAutorisee(ligneId);  
    }  
      
    public void renouveler() {  
        if (statut != StatutAbonnement.ACTIF && statut != StatutAbonnement.EXPIRE) {  
            throw new IllegalStateException("Seuls les abonnements actifs ou expirés peuvent être renouvelés");  
        }  
          
        LocalDate nouvelleDateDebut = LocalDate.now();  
        this.dateDebut = nouvelleDateDebut;  
        this.dateFin = typeAbonnement.calculerDateFin(nouvelleDateDebut);  
        this.statut = StatutAbonnement.ACTIF;  
    }  
      
    public void annuler() {  
        if (statut != StatutAbonnement.ACTIF) {  
            throw new IllegalStateException("Seuls les abonnements actifs peuvent être annulés");  
        }  
        this.statut = StatutAbonnement.ANNULE;  
    }  
}