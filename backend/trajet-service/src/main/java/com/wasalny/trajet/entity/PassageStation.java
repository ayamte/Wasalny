package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.time.LocalTime;  
import java.time.temporal.ChronoUnit;  
import java.util.UUID;  
  
@Entity  
@Table(name = "passage_station",  
       uniqueConstraints = @UniqueConstraint(columnNames = {"trip_id", "ordre"}))  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class PassageStation {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "ordre", nullable = false)  
    private Integer ordre;  
      
    @Column(name = "heure_prevu", nullable = false)  
    private LocalTime heurePrevu;  
      
    @Column(name = "heure_reelle")  
    private LocalTime heureReelle;  

    @Column(name = "heure_estimee")  
    private LocalTime heureEstimee;
      
    @Column(name = "retard_minutes", nullable = false)  
    private Integer retardMinutes = 0;  
      
    @Column(name = "confirme", nullable = false)  
    private Boolean confirme = false;  
      
    // Relations  
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "trip_id", nullable = false)  
    private Trip trip;  
      
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "station_id", nullable = false)  
    private Station station;  
      
    // Méthodes métier  
      
    /**  
     * Confirme le passage à cette station avec l'heure réelle  
     * Calcule automatiquement le retard  
     */  
    public void confirmer(LocalTime heureReelle) {  
        if (this.confirme) {  
            throw new IllegalStateException("Ce passage a déjà été confirmé");  
        }  
        this.heureReelle = heureReelle;  
        this.retardMinutes = calculerRetard();  
        this.confirme = true;  
    }  
      
    /**  
     * Calcule le retard en minutes entre l'heure prévue et l'heure réelle  
     * @return retard en minutes (positif = retard, négatif = avance)  
     */  
    public int calculerRetard() {  
        if (this.heureReelle == null) {  
            return 0;  
        }  
        return (int) ChronoUnit.MINUTES.between(this.heurePrevu, this.heureReelle);  
    }  
      
    /**  
     * Retourne l'heure estimée pour affichage au client  
     * - Si confirmé : retourne heureReelle  
     * - Sinon : retourne heurePrevu + retard accumulé du trip  
     */  
    public LocalTime obtenirHeureEstimee() {  
        if (this.confirme && this.heureReelle != null) {  
            return this.heureReelle;  
        }  
        // Si non confirmé, ajouter le retard accumulé à l'heure prévue  
        return this.heurePrevu.plusMinutes(this.retardMinutes);  
    }  
}