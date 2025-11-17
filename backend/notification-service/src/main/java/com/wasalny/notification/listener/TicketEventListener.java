package com.wasalny.notification.listener;  
  
import com.wasalny.notification.dto.TicketEvent;  
import com.wasalny.notification.service.NotificationService;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.annotation.RabbitListener;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Component;  
  
@Slf4j  
@Component  
public class TicketEventListener {  
      
    @Autowired  
    private NotificationService notificationService;  
      
    @RabbitListener(queues = "ticket.notification.queue")  
    public void handleTicketEvent(TicketEvent event) {  
        log.info("Received ticket event for user: {}", event.getUserId());  
          
        if ("ISSUED".equals(event.getStatus())) {  
            notificationService.createTicketIssuedNotification(  
                event.getUserId(),   
                event.getTicketId(),   
                event.getRouteId()  
            );  
        } else if ("VALIDATED".equals(event.getStatus())) {  
            notificationService.createTicketValidatedNotification(  
                event.getUserId(),   
                event.getTicketId()  
            );  
        }  
    }  
}