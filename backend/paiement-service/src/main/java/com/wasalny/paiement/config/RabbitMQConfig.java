/*Sans ce fichier, votre service ne pourrait pas communiquer avec le notification-service pour envoyer des notifications aux clients après un paiement */
package com.wasalny.paiement.config;  
  
import org.springframework.amqp.core.*;  
import org.springframework.amqp.rabbit.connection.ConnectionFactory;  
import org.springframework.amqp.rabbit.core.RabbitTemplate;  
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;  
  
@Configuration  
public class RabbitMQConfig {  
      
    public static final String PAYMENT_EXCHANGE = "payment.exchange";  //Le bureau de poste central qui reçoit tous les messages
    public static final String PAYMENT_COMPLETED_QUEUE = "payment.completed.queue";  // Pour les paiements réussis
    public static final String PAYMENT_FAILED_QUEUE = "payment.failed.queue";  //Pour les paiements échoués
    public static final String PAYMENT_COMPLETED_ROUTING_KEY = "payment.completed";  
    public static final String PAYMENT_FAILED_ROUTING_KEY = "payment.failed";  
      
    @Bean  
    public TopicExchange paymentExchange() {  
        return new TopicExchange(PAYMENT_EXCHANGE);  
    }  
      
    @Bean  
    public Queue paymentCompletedQueue() {  
        return new Queue(PAYMENT_COMPLETED_QUEUE, true);  
    }  
      
    @Bean  
    public Queue paymentFailedQueue() {  
        return new Queue(PAYMENT_FAILED_QUEUE, true);  
    }  
      
    /*Les Bindings créent des connexions entre l'exchange et les queues.
     Ils disent : "Quand un message arrive à l'exchange avec la routing key payment.completed, 
     envoie-le vers la queue payment.completed.queue". */
    @Bean  
    public Binding paymentCompletedBinding() {  
        return BindingBuilder  
            .bind(paymentCompletedQueue())  
            .to(paymentExchange())  
            .with(PAYMENT_COMPLETED_ROUTING_KEY);  
    }  
      
    @Bean  
    public Binding paymentFailedBinding() {  
        return BindingBuilder  
            .bind(paymentFailedQueue())  
            .to(paymentExchange())  
            .with(PAYMENT_FAILED_ROUTING_KEY);  
    }  
      
    @Bean  
    public Jackson2JsonMessageConverter messageConverter() {  
        ObjectMapper objectMapper = new ObjectMapper();  
        objectMapper.registerModule(new JavaTimeModule());  //pour éviter les erreurs de sérialisation (LocalDateTime par exple)
        return new Jackson2JsonMessageConverter(objectMapper);  
    } 
      
    @Bean  
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {  
        RabbitTemplate template = new RabbitTemplate(connectionFactory);  
        template.setMessageConverter(messageConverter());  
        return template;  
    }  
}