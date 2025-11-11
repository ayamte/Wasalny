package com.wasalny.notification.service;  
  
import com.wasalny.notification.entity.Notification;  
import com.wasalny.notification.repository.NotificationRepository;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Service;  
import java.time.LocalDateTime;  
  
@Service  
public class NotificationService {  
    @Autowired  
    private NotificationRepository notificationRepository;  
      
    public Notification createNotification(String userId, String type, String subject, String message) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(type);  
        notification.setSubject(subject);  
        notification.setMessage(message);  
        notification.setStatus("PENDING");  
        notification.setCreatedAt(LocalDateTime.now());  
        return notificationRepository.save(notification);  
    }  
      
    public void sendNotification(Notification notification) {  
        // Logique d'envoi (email, SMS, push)  
        // Pour l'instant, on marque juste comme envoyé  
        notification.setStatus("SENT");  
        notification.setSentAt(LocalDateTime.now());  
        notificationRepository.save(notification);  
    }  
}