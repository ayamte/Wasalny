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
      
    @Enumerated(EnumType.STRING)  
    private NotificationType type;  
      
    private String title;  
    private String message;  
      
    @Column(name = "is_read")  
    private Boolean isRead = false;  
      
    private LocalDateTime createdAt;  
      
    // Données spécifiques au paiement  
    private String paymentId;  
    private Double amount;  
    private String status; // "SUCCESS", "FAILED"  
      
    @PrePersist  
    protected void onCreate() {  
        createdAt = LocalDateTime.now();  
    }  
}