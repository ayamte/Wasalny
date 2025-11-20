package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.time.LocalTime;  
import java.util.UUID;  
  
@Entity  
@Table(name = "configuration_horaire")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class ConfigurationHoraire {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "heure_debut", nullable = false)  
    private LocalTime heureDebut;  
      
    @Column(name = "heure_fin", nullable = false)  
    private LocalTime heureFin;  
      
    @Column(name = "frequence_minutes", nullable = false)  
    private Integer frequenceMinutes;  
      
    @Column(name = "duree_aller_minutes", nullable = false)  
    private Integer dureeAllerMinutes;  
      
    @Column(name = "duree_retour_minutes", nullable = false)  
    private Integer dureeRetourMinutes;  
      
    @Column(name = "temps_pause_minutes", nullable = false)  
    private Integer tempsPauseMinutes;  
      
    @Column(name = "temps_arret_minutes", nullable = false)  
    private Integer tempsArretMinutes;  
      
    @Column(name = "nombre_bus", nullable = false)  
    private Integer nombreBus;  
      
    @Column(name = "active", nullable = false)  
    private Boolean active = true;  // ✅ Changé de "actif" à "active"  
      
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "ligne_id", nullable = false)  
    private Ligne ligne;  
}