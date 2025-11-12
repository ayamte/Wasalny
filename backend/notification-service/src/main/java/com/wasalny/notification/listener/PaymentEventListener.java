package com.wasalny.notification.listener;  
  
import com.fasterxml.jackson.databind.ObjectMapper;  
import com.wasalny.notification.config.RabbitMQConfig;  
import com.wasalny.notification.dto.PaymentEvent;  
import com.wasalny.notification.service.NotificationService;  
import org.springframework.amqp.rabbit.annotation.RabbitListener;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Component;  
  
@Component  
public class PaymentEventListener {  
      
    @Autowired  
    private NotificationService notificationService;  
      
    @Autowired  
    private ObjectMapper objectMapper;  
      
    @RabbitListener(queues = RabbitMQConfig.PAYMENT_NOTIFICATION_QUEUE)  
    public void handlePaymentEvent(String message) {  
        try {  
            PaymentEvent event = objectMapper.readValue(message, PaymentEvent.class);  
              
            if ("COMPLETED".equals(event.getStatus())) {  
                notificationService.createPaymentSuccessNotification(  
                    event.getUserId(),  
                    event.getPaymentId(),  
                    event.getAmount()  
                );  
            } else if ("FAILED".equals(event.getStatus())) {  
                notificationService.createPaymentFailedNotification(  
                    event.getUserId(),  
                    event.getPaymentId(),  
                    event.getAmount(),  
                    event.getFailureReason()  
                );  
            }  
        } catch (Exception e) {  
            // Log l'erreur  
            System.err.println("Erreur lors du traitement de l'événement de paiement: " + e.getMessage());  
        }  
    }  
}