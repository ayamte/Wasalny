package com.wasalny.trajet.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.hibernate.annotations.GenericGenerator;  
  
import java.time.LocalDate;  
import java.time.LocalTime;  
import java.util.ArrayList;  
import java.util.List;  
import java.util.UUID;  
  
@Entity  
@Table(name = "trip",  
       uniqueConstraints = @UniqueConstraint(columnNames = {"numero_trip"}))  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Trip {  
      
    @Id  
    @GeneratedValue(generator = "UUID")  
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")  
    @Column(name = "id", updatable = false, nullable = false)  
    private UUID id;  
      
    @Column(name = "numero_trip", nullable = false, unique = true, length = 100)  
    private String numeroTrip;  
      
    @Column(name = "date_trip", nullable = false)  
    private LocalDate dateTrip;  
      
    @Column(name = "heure_depart", nullable = false)  
    private LocalTime heureDepart;  
      
    @Column(name = "est_aller", nullable = false)  
    private Boolean estAller;  
      
    @Enumerated(EnumType.STRING)  
    @Column(name = "statut", nullable = false, length = 20)  
    private StatutTrip statut = StatutTrip.PLANIFIE;  
      
    @Column(name = "tickets_vendus", nullable = false)  
    private Integer ticketsVendus = 0;  
      
    @Version  
    @Column(name = "version")  
    private Long version;  
      
    // Relations  
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "bus_id", nullable = false)  
    private Bus bus;  
      
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "ligne_id", nullable = false)  
    private Ligne ligne;  
      
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)  
    @OrderBy("ordre ASC")  
    private List<PassageStation> passageStations = new ArrayList<>();  
      
    // Méthodes métier  
      
    public void demarrer() {  
        if (this.statut != StatutTrip.PLANIFIE) {  
            throw new IllegalStateException("Le trip doit être en statut PLANIFIE pour démarrer");  
        }  
        this.statut = StatutTrip.EN_COURS;  
    }  
      
    public void terminer() {  
        if (this.statut != StatutTrip.EN_COURS) {  
            throw new IllegalStateException("Le trip doit être en statut EN_COURS pour terminer");  
        }  
        this.statut = StatutTrip.TERMINE;  
    }  
      
    public void annuler() {  
        if (this.statut == StatutTrip.TERMINE) {  
            throw new IllegalStateException("Impossible d'annuler un trip terminé");  
        }  
        this.statut = StatutTrip.ANNULE;  
    }  
      
    public boolean aDesPlacesDisponibles() {  
        return this.ticketsVendus < this.bus.getCapacite();  
    }  
      
    public void reserverPlace() {  
        if (!aDesPlacesDisponibles()) {  
            throw new IllegalStateException("Plus de places disponibles dans ce trip");  
        }  
        this.ticketsVendus++;  
    }  
}