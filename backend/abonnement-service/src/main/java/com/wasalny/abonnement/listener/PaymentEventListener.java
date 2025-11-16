package com.wasalny.abonnement.listener;  
  
import com.wasalny.abonnement.dto.PaymentEvent;  
import com.wasalny.abonnement.service.AbonnementService;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.annotation.RabbitListener;  
import org.springframework.stereotype.Component;  
  
@Component  
@RequiredArgsConstructor  
@Slf4j  
public class PaymentEventListener {  
      
    private final AbonnementService abonnementService;  
      
    @RabbitListener(queues = "payment.completed.queue")  
    public void handlePaymentCompleted(PaymentEvent event) {  
        log.info("Événement payment.completed reçu: {}", event.getTransactionId());  
          
        try {  
            if ("ABONNEMENT".equals(event.getTypeService())) {  
                abonnementService.creerAbonnementDepuisPaiement(event);  
                log.info("Abonnement créé avec succès pour transaction: {}", event.getTransactionId());  
            } else {  
                log.info("Type de service non géré: {}", event.getTypeService());  
            }  
        } catch (Exception e) {  
            log.error("Erreur lors de la création de l'abonnement: {}", e.getMessage(), e);  
        }  
    }  
}