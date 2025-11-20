package com.wasalny.abonnement.dto;  
  
import com.wasalny.abonnement.entity.Abonnement;  
import com.wasalny.abonnement.entity.StatutAbonnement;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class AbonnementResponse {  
    private UUID id;  
    private String numeroAbonnement;  
    private UUID clientId;  
    private UUID typeAbonnementId;  
    private String nomTypeAbonnement;  
    private LocalDate dateDebut;  
    private LocalDate dateFin;  
    private LocalDateTime dateAchat;  
    private StatutAbonnement statut;  
    private BigDecimal montantPaye;
    private UUID transactionId;
    private List<UUID> lignesAutorisees;
    private String zoneGeographique;
    private LocalDateTime createdAt;
    private boolean valide;
    private boolean expire;  
      
    public static AbonnementResponse fromEntity(Abonnement abonnement) {
        AbonnementResponse response = new AbonnementResponse();
        response.setId(abonnement.getId());
        response.setNumeroAbonnement(abonnement.getNumeroAbonnement());
        response.setClientId(abonnement.getClientId());
        response.setTypeAbonnementId(abonnement.getTypeAbonnement().getId());
        response.setNomTypeAbonnement(abonnement.getTypeAbonnement().getNom());
        response.setDateDebut(abonnement.getDateDebut());
        response.setDateFin(abonnement.getDateFin());
        response.setDateAchat(abonnement.getDateAchat());
        response.setStatut(abonnement.getStatut());
        response.setMontantPaye(abonnement.getMontantPaye());
        response.setTransactionId(abonnement.getTransactionId());
        response.setLignesAutorisees(abonnement.getLignesAutorisees());
        response.setZoneGeographique(abonnement.getZoneGeographique());
        response.setCreatedAt(abonnement.getCreatedAt());
        response.setValide(abonnement.estValide());
        response.setExpire(abonnement.estExpire());
        return response;
    }  
}