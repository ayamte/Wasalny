package com.wasalny.ticket.config;  
  
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
      
    // Constantes pour les exchanges et queues  
    public static final String PAYMENT_EXCHANGE = "payment.exchange";  
    public static final String PAYMENT_COMPLETED_QUEUE = "payment.completed.queue";  
    public static final String PAYMENT_COMPLETED_ROUTING_KEY = "payment.completed";  
      
    public static final String TICKET_EXCHANGE = "ticket.exchange";  
    public static final String TICKET_ISSUED_QUEUE = "ticket.issued.queue";  
    public static final String TICKET_ISSUED_ROUTING_KEY = "ticket.issued"; 
    public static final String TICKET_REFUNDED_QUEUE = "ticket.refunded.queue";  
    public static final String TICKET_REFUNDED_ROUTING_KEY = "ticket.refunded";  
    
    @Bean  
    public Queue ticketRefundedQueue() {  
        return new Queue(TICKET_REFUNDED_QUEUE, true);  
    }  
    
    @Bean  
    public Binding ticketRefundedBinding() {  
        return BindingBuilder  
            .bind(ticketRefundedQueue())  
            .to(ticketExchange())  
            .with(TICKET_REFUNDED_ROUTING_KEY);  
    } 
      
    // Configuration pour consommer les événements de paiement  
    @Bean  
    public Queue paymentCompletedQueue() {  
        return new Queue(PAYMENT_COMPLETED_QUEUE, true);  
    }  
      
    @Bean  
    public TopicExchange paymentExchange() {  
        return new TopicExchange(PAYMENT_EXCHANGE);  
    }  
      
    @Bean  
    public Binding paymentCompletedBinding() {  
        return BindingBuilder  
            .bind(paymentCompletedQueue())  
            .to(paymentExchange())  
            .with(PAYMENT_COMPLETED_ROUTING_KEY);  
    }  
      
    // Configuration pour publier les événements de ticket  
    @Bean  
    public Queue ticketIssuedQueue() {  
        return new Queue(TICKET_ISSUED_QUEUE, true);  
    }  
      
    @Bean  
    public TopicExchange ticketExchange() {  
        return new TopicExchange(TICKET_EXCHANGE);  
    }  
      
    @Bean  
    public Binding ticketIssuedBinding() {  
        return BindingBuilder  
            .bind(ticketIssuedQueue())  
            .to(ticketExchange())  
            .with(TICKET_ISSUED_ROUTING_KEY);  
    }  
      
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