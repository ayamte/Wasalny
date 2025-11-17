package com.wasalny.notification.dto;  
  
import lombok.Data;  
import java.time.LocalDateTime;  
  
@Data  
public class SubscriptionEvent {  
    private String userId;  
    private String subscriptionId;  
    private String status; // "RENEWED" ou "EXPIRED"  
    private LocalDateTime expiryDate;  
}