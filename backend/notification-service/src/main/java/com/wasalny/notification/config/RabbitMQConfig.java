package com.wasalny.notification.config;  
  
import org.springframework.amqp.core.*;  
import org.springframework.amqp.rabbit.connection.ConnectionFactory;  
import org.springframework.amqp.rabbit.core.RabbitTemplate;  
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
@Configuration  
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
      
    // Message converter  
    @Bean  
    public Jackson2JsonMessageConverter messageConverter() {  
        return new Jackson2JsonMessageConverter();  
    }  
      
    @Bean  
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {  
        RabbitTemplate template = new RabbitTemplate(connectionFactory);  
        template.setMessageConverter(messageConverter());  
        return template;  
    }  
}