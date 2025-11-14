package com.wasalny.ticket.listener;  
  
import com.wasalny.ticket.dto.PaymentEvent;  
import com.wasalny.ticket.service.TicketService;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.annotation.RabbitListener;  
import org.springframework.stereotype.Component;  
  
@Component  
@RequiredArgsConstructor  
@Slf4j  
public class PaymentEventListener {  
      
    private final TicketService ticketService;  
      
    @RabbitListener(queues = "payment.completed.queue")  
    public void handlePaymentCompleted(PaymentEvent event) {  
        log.info("Événement payment.completed reçu: transactionId={}, clientId={}, typeService={}",   
                 event.getTransactionId(), event.getClientId(), event.getTypeService());  
          
        try {  
            // Vérifier que c'est bien un achat de ticket  
            if ("ACHAT_TICKET".equals(event.getTypeService())) {  
                log.info("Création du ticket pour la transaction: {}", event.getTransactionId());  
                ticketService.creerTicketDepuisPaiement(event);  
                log.info("Ticket créé avec succès pour transaction: {}", event.getTransactionId());  
            } else {  
                log.info("Type de service non géré: {} - Aucun ticket créé", event.getTypeService());  
            }  
        } catch (Exception e) {  
            log.error("Erreur lors de la création du ticket pour transaction {}: {}",   
                     event.getTransactionId(), e.getMessage(), e);  
            // En production, vous pourriez vouloir republier l'événement dans une Dead Letter Queue  
        }  
    }  
}