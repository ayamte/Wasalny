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
@Table(name = "bus")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Bus {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "numero_immatriculation", nullable = false, unique = true, length = 50)  
    private String numeroImmatriculation;  
      
    @Column(name = "capacite", nullable = false)  
    private Integer capacite;  
      
    @Column(name = "modele", nullable = false, length = 100)  
    private String modele;  
      
    @Column(name = "active", nullable = false)  
    private Boolean active = true;  

    @Column(name = "latitude_actuelle")  
    private Double latitudeActuelle;  
      
    @Column(name = "longitude_actuelle")  
    private Double longitudeActuelle;  
      
    @Column(name = "metre_avant_arret", nullable = false, precision = 10, scale = 2)  
    private BigDecimal metreAvantArret = BigDecimal.ZERO;  
      
    // Relations  
    @OneToMany(mappedBy = "bus", fetch = FetchType.LAZY)  
    private List<Trip> trips = new ArrayList<>();  
      
    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)  
    private List<AssignationBusConducteur> assignations = new ArrayList<>();  
}