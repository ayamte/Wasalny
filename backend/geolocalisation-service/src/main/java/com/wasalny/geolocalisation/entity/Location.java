package com.wasalny.geolocalisation.entity;  
  
import jakarta.persistence.*;  
import lombok.Data;  
import java.time.LocalDateTime;  
  
@Entity  
@Table(name = "locations")  
@Data  
public class Location {  
    @Id  
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Long id;  
      
    private Double latitude;  
    private Double longitude;  
    private String userId;  
      
    @Column(name = "created_at")  
    private LocalDateTime createdAt;  
      
    @PrePersist  
    protected void onCreate() {  
        createdAt = LocalDateTime.now();  
    }  
}