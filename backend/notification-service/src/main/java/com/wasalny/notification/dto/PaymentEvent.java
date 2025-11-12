package com.wasalny.notification.dto;  
  
import lombok.Data;  
 
  
@Data  
public class PaymentEvent {  
    private String paymentId;  
    private String userId;  
    private Double amount;  
    private String status; // "COMPLETED", "FAILED"  
    private String transactionId;  
    private String failureReason;  
}