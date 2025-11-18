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
      
    // Notifications de paiement  
    public Notification createPaymentSuccessNotification(String userId, String paymentId, Double amount) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(NotificationType.PAYMENT);  
        notification.setTitle("Paiement réussi");  
        notification.setMessage("Votre paiement de " + amount + " DH a été effectué avec succès");  
        notification.setPaymentId(paymentId);  
        notification.setAmount(amount);  
        return notificationRepository.save(notification);  
    }  
      
    public Notification createPaymentFailedNotification(String userId, String paymentId, String reason) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(NotificationType.PAYMENT);  
        notification.setTitle("Paiement échoué");  
        notification.setMessage("Votre paiement n'a pas pu être traité. Raison: " + reason);  
        notification.setPaymentId(paymentId);  
        return notificationRepository.save(notification);  
    }  
      
    // Notifications de ticket  
    public Notification createTicketIssuedNotification(String userId, String ticketId, String routeId) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(NotificationType.TICKET);  
        notification.setTitle("Ticket émis");  
        notification.setMessage("Votre ticket pour le trajet " + routeId + " a été émis avec succès");  
        notification.setTicketId(ticketId);  
        return notificationRepository.save(notification);  
    }  
      
    public Notification createTicketValidatedNotification(String userId, String ticketId) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(NotificationType.TICKET);  
        notification.setTitle("Ticket validé");  
        notification.setMessage("Votre ticket " + ticketId + " a été validé avec succès");  
        notification.setTicketId(ticketId);  
        return notificationRepository.save(notification);  
    }  
      
    // Notifications d'abonnement
    public Notification createSubscriptionNotification(String userId, String subscriptionId,
                                                      String numeroAbonnement, String nomType,
                                                      java.time.LocalDate dateDebut, java.time.LocalDate dateFin) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(NotificationType.SUBSCRIPTION);
        notification.setTitle("Nouvel abonnement activé");
        notification.setMessage("Votre abonnement " + nomType + " (N°" + numeroAbonnement +
                ") a été activé avec succès. Valide du " + dateDebut + " au " + dateFin);
        notification.setSubscriptionId(subscriptionId);
        return notificationRepository.save(notification);
    }

    public Notification createSubscriptionRenewedNotification(String userId, String subscriptionId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(NotificationType.SUBSCRIPTION);
        notification.setTitle("Abonnement renouvelé");
        notification.setMessage("Votre abonnement a été renouvelé avec succès");
        notification.setSubscriptionId(subscriptionId);
        return notificationRepository.save(notification);
    }  
      
    public Notification createSubscriptionExpiredNotification(String userId, String subscriptionId) {  
        Notification notification = new Notification();  
        notification.setUserId(userId);  
        notification.setType(NotificationType.SUBSCRIPTION);  
        notification.setTitle("Abonnement expiré");  
        notification.setMessage("Votre abonnement a expiré. Veuillez le renouveler pour continuer à utiliser le service");  
        notification.setSubscriptionId(subscriptionId);  
        return notificationRepository.save(notification);  
    }  
      
    // Récupération des notifications  
    public List<Notification> getUserNotifications(String userId) {  
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);  
    }  
      
    public List<Notification> getUnreadNotifications(String userId) {  
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);  
    }  
      
    public Notification getNotificationById(Long id) {  
        return notificationRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));  
    }  
      
    // Mise à jour  
    public Notification markAsRead(Long notificationId) {  
        Notification notification = notificationRepository.findById(notificationId)  
            .orElseThrow(() -> new RuntimeException("Notification not found"));  
        notification.setIsRead(true);  
        return notificationRepository.save(notification);  
    }  
      
    // Suppression  
    public void deleteNotification(Long notificationId) {  
        Notification notification = notificationRepository.findById(notificationId)  
            .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));  
        notificationRepository.delete(notification);  
    }  
}