package com.wasalny.notification.listener;  
  
import com.wasalny.notification.service.NotificationService;  
import org.springframework.amqp.rabbit.annotation.RabbitListener;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Component;  
  
@Component  
public class PaymentEventListener {  
    @Autowired  
    private NotificationService notificationService;  
      
    @RabbitListener(queues = "payment.completed")  
    public void handlePaymentCompleted(String message) {  
        // Parser le message et créer une notification  
        // Exemple simplifié  
        var notification = notificationService.createNotification(  
            "userId",   
            "EMAIL",   
            "Paiement confirmé",   
            "Votre paiement a été traité avec succès"  
        );  
        notificationService.sendNotification(notification);  
    }  
}