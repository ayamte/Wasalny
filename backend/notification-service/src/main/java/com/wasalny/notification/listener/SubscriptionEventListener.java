package com.wasalny.notification.listener;  
  
import com.wasalny.notification.dto.SubscriptionEvent;  
import com.wasalny.notification.service.NotificationService;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.annotation.RabbitListener;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Component;  
  
@Slf4j  
@Component  
public class SubscriptionEventListener {  
      
    @Autowired  
    private NotificationService notificationService;  
      
    @RabbitListener(queues = "subscription.notification.queue")  
    public void handleSubscriptionEvent(SubscriptionEvent event) {  
        log.info("Received subscription event for user: {}", event.getUserId());  
          
        if ("RENEWED".equals(event.getStatus())) {  
            notificationService.createSubscriptionRenewedNotification(  
                event.getUserId(),   
                event.getSubscriptionId()  
            );  
        } else if ("EXPIRED".equals(event.getStatus())) {  
            notificationService.createSubscriptionExpiredNotification(  
                event.getUserId(),   
                event.getSubscriptionId()  
            );  
        }  
    }  
}