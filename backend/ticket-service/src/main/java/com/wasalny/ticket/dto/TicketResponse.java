package com.wasalny.ticket.dto;  
  
import com.wasalny.ticket.entity.Ticket;  
import com.wasalny.ticket.entity.StatutTicket;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.time.LocalDateTime;  
import java.util.UUID;  
  
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private UUID id;
    private String numeroTicket;
    private UUID clientId;
    private UUID tripId;
    private String numeroTrip;
    private UUID ligneId;
    private String nomLigne;
    private UUID stationDepartId;
    private String nomStationDepart;
    private UUID stationFinaleId;
    private String nomStationFinale;
    private LocalDateTime dateAchat;
    private BigDecimal prix;
    private StatutTicket statut;
    private UUID transactionId;
    private LocalDateTime createdAt;  
      
    public static TicketResponse fromEntity(Ticket ticket) {
        return new TicketResponse(
            ticket.getId(),
            ticket.getNumeroTicket(),
            ticket.getClientId(),
            ticket.getTripId(),
            ticket.getNumeroTrip(),
            ticket.getLigneId(),
            ticket.getNomLigne(),
            ticket.getStationDepartId(),
            ticket.getNomStationDepart(),
            ticket.getStationFinaleId(),
            ticket.getNomStationFinale(),
            ticket.getDateAchat(),
            ticket.getPrix(),
            ticket.getStatut(),
            ticket.getTransactionId(),
            ticket.getCreatedAt()
        );
    }  
}
