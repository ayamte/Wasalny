package com.wasalny.notification.entity;  
  
import jakarta.persistence.*;  
import lombok.Data;  
import java.time.LocalDateTime;  
  
@Entity  
@Table(name = "notifications")  
@Data  
public class Notification {  
    @Id  
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Long id;  
      
    private String userId;  
    private String type; // EMAIL, SMS, PUSH  
    private String subject;  
    private String message;  
    private String status; // SENT, FAILED, PENDING  
    private LocalDateTime createdAt;  
    private LocalDateTime sentAt;  
}