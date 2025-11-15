package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.util.UUID;  
  
@Entity  
@Table(name = "ligne_station",   
       uniqueConstraints = @UniqueConstraint(columnNames = {"ligne_id", "ordre"}))  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LigneStation {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "ordre", nullable = false)  
    private Integer ordre;  
      
    @Column(name = "temps_arret_minutes", nullable = false)  
    private Integer tempsArretMinutes;  
      
    @Column(name = "distance_km_depart", nullable = false)  
    private Double distanceKmDepart;  
      
    // Relations  
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "ligne_id", nullable = false)  
    private Ligne ligne;  
      
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "station_id", nullable = false)  
    private Station station;  
}