package com.wasalny.abonnement.config;  
  
import com.fasterxml.jackson.databind.ObjectMapper;  
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;  
import org.springframework.amqp.core.*;  
import org.springframework.amqp.rabbit.connection.ConnectionFactory;  
import org.springframework.amqp.rabbit.core.RabbitTemplate;  
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;  
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {  
      
    // Exchanges  
    public static final String PAYMENT_EXCHANGE = "payment.exchange";  
    public static final String ABONNEMENT_EXCHANGE = "abonnement.exchange";  
      
    // Queues  
    public static final String PAYMENT_COMPLETED_QUEUE = "payment.completed.queue";  
    public static final String ABONNEMENT_ISSUED_QUEUE = "abonnement.issued.queue";  
    public static final String ABONNEMENT_RENEWED_QUEUE = "abonnement.renewed.queue";  
    public static final String ABONNEMENT_EXPIRED_QUEUE = "abonnement.expired.queue";  
    public static final String ABONNEMENT_CANCELLED_QUEUE = "abonnement.cancelled.queue";  
      
    // Routing Keys  
    public static final String PAYMENT_COMPLETED_ROUTING_KEY = "payment.completed";  
    public static final String ABONNEMENT_ISSUED_ROUTING_KEY = "abonnement.issued";  
    public static final String ABONNEMENT_RENEWED_ROUTING_KEY = "abonnement.renewed";  
    public static final String ABONNEMENT_EXPIRED_ROUTING_KEY = "abonnement.expired";  
    public static final String ABONNEMENT_CANCELLED_ROUTING_KEY = "abonnement.cancelled";  
      
    // Payment Exchange (pour consommer)  
    @Bean  
    public TopicExchange paymentExchange() {  
        return new TopicExchange(PAYMENT_EXCHANGE);  
    }  
      
    // Abonnement Exchange (pour publier)  
    @Bean  
    public TopicExchange abonnementExchange() {  
        return new TopicExchange(ABONNEMENT_EXCHANGE);  
    }  
      
    // Queue pour consommer les événements de paiement  
    @Bean  
    public Queue paymentCompletedQueue() {  
        return new Queue(PAYMENT_COMPLETED_QUEUE, true);  
    }  
      
    // Queues pour publier les événements d'abonnement  
    @Bean  
    public Queue abonnementIssuedQueue() {  
        return new Queue(ABONNEMENT_ISSUED_QUEUE, true);  
    }  
      
    @Bean  
    public Queue abonnementRenewedQueue() {  
        return new Queue(ABONNEMENT_RENEWED_QUEUE, true);  
    }  
      
    @Bean  
    public Queue abonnementExpiredQueue() {  
        return new Queue(ABONNEMENT_EXPIRED_QUEUE, true);  
    }  
      
    @Bean  
    public Queue abonnementCancelledQueue() {  
        return new Queue(ABONNEMENT_CANCELLED_QUEUE, true);  
    }  
      
    // Binding pour consommer payment.completed  
    @Bean  
    public Binding paymentCompletedBinding() {  
        return BindingBuilder  
            .bind(paymentCompletedQueue())  
            .to(paymentExchange())  
            .with(PAYMENT_COMPLETED_ROUTING_KEY);  
    }  
      
    // Bindings pour publier les événements d'abonnement  
    @Bean  
    public Binding abonnementIssuedBinding() {  
        return BindingBuilder  
            .bind(abonnementIssuedQueue())  
            .to(abonnementExchange())  
            .with(ABONNEMENT_ISSUED_ROUTING_KEY);  
    }  
      
    @Bean  
    public Binding abonnementRenewedBinding() {  
        return BindingBuilder  
            .bind(abonnementRenewedQueue())  
            .to(abonnementExchange())  
            .with(ABONNEMENT_RENEWED_ROUTING_KEY);  
    }  
      
    @Bean  
    public Binding abonnementExpiredBinding() {  
        return BindingBuilder  
            .bind(abonnementExpiredQueue())  
            .to(abonnementExchange())  
            .with(ABONNEMENT_EXPIRED_ROUTING_KEY);  
    }  
      
    @Bean  
    public Binding abonnementCancelledBinding() {  
        return BindingBuilder  
            .bind(abonnementCancelledQueue())  
            .to(abonnementExchange())  
            .with(ABONNEMENT_CANCELLED_ROUTING_KEY);  
    }  
      
    // Message Converter avec support JSR310 pour LocalDate/LocalDateTime  
    @Bean  
    public Jackson2JsonMessageConverter messageConverter() {  
        ObjectMapper objectMapper = new ObjectMapper();  
        objectMapper.registerModule(new JavaTimeModule());  
        return new Jackson2JsonMessageConverter(objectMapper);  
    }  
      
    @Bean  
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {  
        RabbitTemplate template = new RabbitTemplate(connectionFactory);  
        template.setMessageConverter(messageConverter());  
        return template;  
    }
}