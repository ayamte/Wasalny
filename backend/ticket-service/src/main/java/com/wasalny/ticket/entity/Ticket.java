package com.wasalny.ticket.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.time.LocalDateTime;  
import java.util.UUID;  
  
@Entity  
@Table(name = "tickets")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class Ticket {  
      
    @Id  
    @GeneratedValue(strategy = GenerationType.UUID)  
    private UUID id;  
      
    @Column(nullable = false, unique = true, length = 20)  
    private String numeroTicket;  
      
    @Column(nullable = false)  
    private UUID clientId;  
      
    @Column(nullable = false)
    private UUID tripId;

    @Column(nullable = false, length = 50)
    private String numeroTrip;

    @Column(name = "ligne_id")
    private UUID ligneId;

    @Column(name = "nom_ligne", length = 200)
    private String nomLigne;

    @Column(name = "station_depart_id")
    private UUID stationDepartId;

    @Column(name = "nom_station_depart", length = 200)
    private String nomStationDepart;

    @Column(nullable = false)
    private UUID stationFinaleId;

    @Column(nullable = false, length = 200)
    private String nomStationFinale;  
      
    @Column(nullable = false)  
    private LocalDateTime dateAchat;  
      
    @Column(nullable = false, precision = 10, scale = 2)  
    private BigDecimal prix;  
      
    @Enumerated(EnumType.STRING)  
    @Column(nullable = false, length = 20)  
    private StatutTicket statut;  
      
    @Column(nullable = false)  
    private UUID transactionId;  
      
    @Column(updatable = false)  
    private LocalDateTime createdAt;  
      
    @PrePersist  
    protected void onCreate() {  
        createdAt = LocalDateTime.now();  
        if (dateAchat == null) {  
            dateAchat = LocalDateTime.now();  
        }  
    }  
}