package com.wasalny.notification.service;  
  
import com.wasalny.notification.entity.Notification;  
import com.wasalny.notification.entity.NotificationType;  
import com.wasalny.notification.repository.NotificationRepository;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Service;  
import java.util.List;  
  
@Service  
public class NotificationService {  
    @Autowired  
    private NotificationRepository notificationRepository;  
      
    public Notification createPaymentSuccessNotification(String userId, String paymentId, Double amount) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(NotificationType.PAYMENT_SUCCESS);  
        notification.setTitle("Paiement réussi");  
        notification.setMessage(String.format("Votre paiement de %.2f MAD a été effectué avec succès", amount));  
        notification.setPaymentId(paymentId);  
        notification.setAmount(amount);  
        notification.setStatus("SUCCESS");  
          
        return notificationRepository.save(notification);  
    }  
      
    public Notification createPaymentFailedNotification(String userId, String paymentId, Double amount, String reason) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(NotificationType.PAYMENT_FAILED);  
        notification.setTitle("Échec du paiement");  
        notification.setMessage(String.format("Votre paiement de %.2f MAD n'a pas pu être traité. Raison: %s", amount, reason));  
        notification.setPaymentId(paymentId);  
        notification.setAmount(amount);  
        notification.setStatus("FAILED");  
          
        return notificationRepository.save(notification);  
    }  
      
    public List<Notification> getUserNotifications(String userId) {  
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);  
    }  
      
    public List<Notification> getUnreadNotifications(String userId) {  
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);  
    }  
      
    public Notification markAsRead(Long notificationId) {  
        Notification notification = notificationRepository.findById(notificationId)  
            .orElseThrow(() -> new RuntimeException("Notification not found"));  
        notification.setIsRead(true);  
        return notificationRepository.save(notification);  
    }  
}