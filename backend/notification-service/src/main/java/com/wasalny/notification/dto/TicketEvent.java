package com.wasalny.notification.dto;  
  
import lombok.Data;  
  
@Data  
public class TicketEvent {  
    private String userId;  
    private String ticketId;  
    private String routeId;  
    private String status; // "ISSUED" ou "VALIDATED"  
}