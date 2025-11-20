package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.math.BigDecimal;  
import java.util.ArrayList;  
import java.util.List;  
import java.util.UUID;  
  
@Entity  
@Table(name = "ligne")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Ligne {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "numero", nullable = false, unique = true, length = 50)  
    private String numero;  
      
    @Column(name = "nom", nullable = false, length = 200)  
    private String nom;  
      
    @Column(name = "prix_standard", nullable = false, precision = 10, scale = 2)  
    private BigDecimal prixStandard;  
      
    @Column(name = "vitesse_standard_kmh", nullable = false)  
    private Double vitesseStandardKmH;  
      
    @Column(name = "active", nullable = false)  
    private Boolean active = true; 
    
    @Column(name = "distance_totale_km")  
    private Double distanceTotaleKm; 
      
    // Relations  
    @OneToOne(mappedBy = "ligne", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)  
    private ConfigurationHoraire configurationHoraire;  
      
    @OneToMany(mappedBy = "ligne", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)  
    @OrderBy("ordre ASC")  
    private List<LigneStation> ligneStations = new ArrayList<>();  
      
    @OneToMany(mappedBy = "ligne", fetch = FetchType.LAZY)  
    private List<Trip> trips = new ArrayList<>();  
}