package com.wasalny.notification.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
@Configuration
@EnableRabbit
public class RabbitMQConfig {  
      
    // Exchanges  
    @Bean  
    public TopicExchange paymentExchange() {  
        return new TopicExchange("payment.exchange");  
    }  
      
    @Bean  
    public TopicExchange ticketExchange() {  
        return new TopicExchange("ticket.exchange");  
    }  
      
    @Bean
    public TopicExchange subscriptionExchange() {
        return new TopicExchange("subscription.exchange");
    }

    @Bean
    public TopicExchange abonnementExchange() {
        return new TopicExchange("abonnement.exchange");
    }  
      
    // Queues  
    @Bean  
    public Queue paymentNotificationQueue() {  
        return new Queue("payment.notification.queue", true);  
    }  
      
    @Bean  
    public Queue ticketNotificationQueue() {  
        return new Queue("ticket.notification.queue", true);  
    }  
      
    @Bean  
    public Queue subscriptionNotificationQueue() {  
        return new Queue("subscription.notification.queue", true);  
    }  
      
    // Bindings  
    @Bean  
    public Binding paymentBinding() {  
        return BindingBuilder  
            .bind(paymentNotificationQueue())  
            .to(paymentExchange())  
            .with("payment.*");  
    }  
      
    @Bean  
    public Binding ticketBinding() {  
        return BindingBuilder  
            .bind(ticketNotificationQueue())  
            .to(ticketExchange())  
            .with("ticket.*");  
    }  
      
    @Bean
    public Binding subscriptionBinding() {
        return BindingBuilder
            .bind(subscriptionNotificationQueue())
            .to(subscriptionExchange())
            .with("subscription.*");
    }

    @Bean
    public Binding abonnementNotificationBinding() {
        return BindingBuilder
            .bind(subscriptionNotificationQueue())
            .to(abonnementExchange())
            .with("abonnement.issued");
    }  
      
    // Message converter with Java 8 date/time support
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