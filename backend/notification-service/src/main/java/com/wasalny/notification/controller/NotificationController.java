package com.wasalny.notification.controller;  
  
import com.wasalny.notification.entity.Notification;  
import com.wasalny.notification.service.NotificationService;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.*;  
  
import java.util.List;  
  
@RestController  
@RequestMapping("/notifications")  
public class NotificationController {  
      
    @Autowired  
    private NotificationService notificationService;  
      
    /**  
     * Récupérer toutes les notifications d'un utilisateur  
     * GET /notifications?userId=xxx  
     */  
    @GetMapping  
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestParam String userId) {  
        List<Notification> notifications = notificationService.getUserNotifications(userId);  
        return ResponseEntity.ok(notifications);  
    }  
      
    /**  
     * Récupérer les notifications non lues d'un utilisateur  
     * GET /notifications/unread?userId=xxx  
     */  
    @GetMapping("/unread")  
    public ResponseEntity<List<Notification>> getUnreadNotifications(@RequestParam String userId) {  
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);  
        return ResponseEntity.ok(notifications);  
    }  
      
    /**  
     * Marquer une notification comme lue  
     * PUT /notifications/{id}/read  
     */  
    @PutMapping("/{id}/read")  
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {  
        Notification notification = notificationService.markAsRead(id);  
        return ResponseEntity.ok(notification);  
    }  
      
    /**  
     * Récupérer une notification par ID  
     * GET /notifications/{id}  
     */  
    @GetMapping("/{id}")  
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {  
        Notification notification = notificationService.getNotificationById(id);  
        return notification != null ? ResponseEntity.ok(notification) : ResponseEntity.notFound().build();  
    }  
}