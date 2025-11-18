package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.time.LocalDate;  
import java.util.UUID;  
  
@Entity  
@Table(name = "assignation_bus_conducteur")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class AssignationBusConducteur {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "conducteur_id", nullable = false)  
    private UUID conducteurId;  
      
    @Column(name = "date_debut", nullable = false)  
    private LocalDate dateDebut;  
      
    @Column(name = "date_fin", nullable = false)  
    private LocalDate dateFin;  
      
    @Column(name = "active", nullable = false)  
    private Boolean active = true;  
      
    // Relations  
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "bus_id", nullable = false)  
    private Bus bus;  
}