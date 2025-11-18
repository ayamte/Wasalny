package com.wasalny.notification.listener;

import com.wasalny.notification.dto.AbonnementEvent;
import com.wasalny.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AbonnementEventListener {

    @Autowired
    private NotificationService notificationService;

    @RabbitListener(queues = "subscription.notification.queue")
    public void handleAbonnementIssuedEvent(AbonnementEvent event) {
        log.info("Received abonnement.issued event - Abonnement: {}, Client: {}",
                event.getNumeroAbonnement(), event.getClientId());

        notificationService.createSubscriptionNotification(
            event.getClientId().toString(),
            event.getAbonnementId().toString(),
            event.getNumeroAbonnement(),
            event.getNomTypeAbonnement(),
            event.getDateDebut(),
            event.getDateFin()
        );

        log.info("Notification d'abonnement créée pour client: {}", event.getClientId());
    }
}
