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
      
    @Column(name = "created_at")  
    private LocalDateTime createdAt;  
      
    // Métadonnées spécifiques selon le type  
    private String paymentId;  
    private Double amount;  
    private String ticketId;  
    private String subscriptionId;  
      
    @PrePersist  
    protected void onCreate() {  
        createdAt = LocalDateTime.now();  
    }  
}