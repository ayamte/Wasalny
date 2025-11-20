package com.wasalny.notification.listener;  
  
import com.wasalny.notification.dto.PaymentEvent;  
import com.wasalny.notification.service.NotificationService;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.annotation.RabbitListener;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Component;  
  
@Slf4j  
@Component  
public class PaymentEventListener {  
      
    @Autowired  
    private NotificationService notificationService;  
      
    @RabbitListener(queues = "payment.notification.queue")
    public void handlePaymentEvent(PaymentEvent event) {
        log.info("Received payment event - Transaction: {}, Client: {}, Status: {}",
                event.getTransactionId(), event.getClientId(), event.getStatut());

        if ("REUSSIE".equals(event.getStatut())) {
            notificationService.createPaymentSuccessNotification(
                event.getClientId().toString(),
                event.getTransactionId().toString(),
                event.getMontant().doubleValue()
            );
            log.info("Notification de paiement réussi créée pour client: {}", event.getClientId());
        } else if ("ECHOUEE".equals(event.getStatut())) {
            notificationService.createPaymentFailedNotification(
                event.getClientId().toString(),
                event.getTransactionId().toString(),
                event.getMotifEchec()
            );
            log.info("Notification de paiement échoué créée pour client: {}", event.getClientId());
        }
    }  
}