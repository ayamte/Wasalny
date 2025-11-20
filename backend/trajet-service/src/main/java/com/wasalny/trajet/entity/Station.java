package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.util.ArrayList;  
import java.util.List;  
import java.util.UUID;  
  
@Entity  
@Table(name = "station")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Station {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "nom", nullable = false, length = 100)  
    private String nom;  
      
    @Column(name = "latitude", nullable = false)  
    private Double latitude;  
      
    @Column(name = "longitude", nullable = false)  
    private Double longitude;  
      
    @Column(name = "capacite")  
    private Integer capacite;  
      
    @Column(name = "active", nullable = false)  
    private Boolean active = true;  
      
    // Relations  
    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)  
    private List<LigneStation> ligneStations = new ArrayList<>();  
      
    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)  
    private List<PassageStation> passageStations = new ArrayList<>();  
}