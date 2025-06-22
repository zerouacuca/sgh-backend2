package com.sgh.ms_autenticacao.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue}")
    private String queue;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routingkey}")
    private String routingKey;

    @Bean
    public Queue usuarioQueue() {
        return new Queue(queue, true); // durable=true
    }

    @Bean
    public DirectExchange usuarioExchange() {
        return new DirectExchange(exchange);
    }

    @Bean
    public Binding bindingUsuarioQueue() {
        return BindingBuilder
                .bind(usuarioQueue())
                .to(usuarioExchange())
                .with(routingKey);
    }
}