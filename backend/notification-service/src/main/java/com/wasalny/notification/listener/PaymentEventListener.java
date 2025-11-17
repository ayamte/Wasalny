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
        log.info("Received payment event for user: {}", event.getUserId());  
          
        if ("SUCCESS".equals(event.getStatus())) {  
            notificationService.createPaymentSuccessNotification(  
                event.getUserId(),   
                event.getPaymentId(),   
                event.getAmount()  
            );  
        } else if ("FAILED".equals(event.getStatus())) {  
            notificationService.createPaymentFailedNotification(  
                event.getUserId(),   
                event.getPaymentId(),   
                event.getFailureReason()  
            );  
        }  
    }  
}