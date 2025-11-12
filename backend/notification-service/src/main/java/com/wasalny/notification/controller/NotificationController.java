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
      
    @GetMapping  
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestParam String userId) {  
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));  
    }  
      
    @GetMapping("/unread")  
    public ResponseEntity<List<Notification>> getUnreadNotifications(@RequestParam String userId) {  
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));  
    }  
      
    @PutMapping("/{id}/read")  
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {  
        return ResponseEntity.ok(notificationService.markAsRead(id));  
    }  
}