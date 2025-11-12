package com.wasalny.notification.config;  
  
import org.springframework.amqp.core.*;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
@Configuration  
public class RabbitMQConfig {  
      
    // Exchange pour les événements de paiement  
    public static final String PAYMENT_EXCHANGE = "payment.exchange";  
      
    // Queues  
    public static final String PAYMENT_NOTIFICATION_QUEUE = "payment.notification.queue";  
      
    // Routing keys  
    public static final String PAYMENT_COMPLETED_KEY = "payment.completed";  
    public static final String PAYMENT_FAILED_KEY = "payment.failed";  
      
    @Bean  
    public TopicExchange paymentExchange() {  
        return new TopicExchange(PAYMENT_EXCHANGE);  
    }  
      
    @Bean  
    public Queue paymentNotificationQueue() {  
        return new Queue(PAYMENT_NOTIFICATION_QUEUE, true); // durable = true  
    }  
      
    @Bean  
    public Binding paymentCompletedBinding() {  
        return BindingBuilder  
            .bind(paymentNotificationQueue())  
            .to(paymentExchange())  
            .with(PAYMENT_COMPLETED_KEY);  
    }  
      
    @Bean  
    public Binding paymentFailedBinding() {  
        return BindingBuilder  
            .bind(paymentNotificationQueue())  
            .to(paymentExchange())  
            .with(PAYMENT_FAILED_KEY);  
    }  
}