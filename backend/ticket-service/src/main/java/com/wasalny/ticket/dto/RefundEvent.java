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
public class RefundEvent {  
    private UUID ticketId;  
    private String numeroTicket;  
    private UUID clientId;  
    private BigDecimal montantRembourse;  
    private LocalDateTime dateRemboursement;  
}