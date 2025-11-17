package com.wasalny.notification.dto;  
  
import lombok.Data;  
  
@Data  
public class PaymentEvent {  
    private String userId;  
    private String paymentId;  
    private Double amount;  
    private String status; // "SUCCESS" ou "FAILED"  
    private String failureReason;  
}