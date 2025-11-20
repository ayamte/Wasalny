package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.util.UUID;  

@Entity  
@Table(name = "ligne_station")  
@Data  
public class LigneStation {  
      
    @Id  
    @GeneratedValue(strategy = GenerationType.UUID)  
    private UUID id;  
      
    @ManyToOne  
    @JoinColumn(name = "ligne_id", nullable = false)  
    private Ligne ligne;  
      
    @ManyToOne  
    @JoinColumn(name = "station_id", nullable = false)  
    private Station station;  
      
    @Column(nullable = false)  
    private Integer ordre;  
      
    @Column(name = "distance_cumulee_km")  
    private Double distanceCumuleeKm;  
}