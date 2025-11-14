/*DTO pour publier les événements de ticket vers RabbitMQ (pour le notification-service). */
package com.wasalny.ticket.dto;  
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.time.LocalDateTime;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class TicketEvent {  
    private UUID ticketId;  
    private String numeroTicket;  
    private UUID clientId;  
    private UUID tripId;  
    private String numeroTrip;  
    private BigDecimal prix;  
    private LocalDateTime dateAchat;  
}