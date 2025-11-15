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
      
    @Column(name = "actif", nullable = false)  
    private Boolean actif = true;  
      
    @Column(name = "intervalle_minutes", nullable = false)  
    private Integer intervalleMinutes;  
      
    @Column(name = "nombre_bus", nullable = false)  
    private Integer nombreBus;  
      
    @Column(name = "heure_debut", nullable = false)  
    private LocalTime heureDebut;  
      
    @Column(name = "duree_aller_minutes", nullable = false)  
    private Integer dureeAllerMinutes;  
      
    @Column(name = "duree_retour_minutes", nullable = false)  
    private Integer dureeRetourMinutes;  
      
    @Column(name = "temps_pause_minutes", nullable = false)  
    private Integer tempsPauseMinutes;  
      
    // Relations  
    @OneToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "ligne_id", nullable = false, unique = true)  
    private Ligne ligne;  
}