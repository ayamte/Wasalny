package com.wasalny.geolocalisation.entity;    
    
import jakarta.persistence.*;    
import lombok.Data;    
import java.time.LocalDateTime;    
import java.util.UUID;  
    
@Entity    
@Table(name = "locations")    
@Data    
public class Location {    
    @Id    
    @GeneratedValue(strategy = GenerationType.IDENTITY)    
    private Long id;    
        
    private Double latitude;    
    private Double longitude;    
      
    @Column(name = "bus_id")    
    private String busId;  // Changé de UUID à String pour compatibilité  
        
    @Column(name = "created_at")    
    private LocalDateTime createdAt;    
        
    @PrePersist    
    protected void onCreate() {    
        createdAt = LocalDateTime.now();    
    }    
}