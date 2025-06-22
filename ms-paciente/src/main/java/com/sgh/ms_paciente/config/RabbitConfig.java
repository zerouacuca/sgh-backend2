package com.sgh.ms_paciente.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Value("${rabbitmq.queue}")
    private String queue;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routingkey}")
    private String routingKey;

    @Bean
    public Queue filaUsuarioNovo() {
        return new Queue(queue, true);
    }

    @Bean
    public DirectExchange exchangeUsuario() {
        return new DirectExchange(exchange);
    }

    @Bean
    public Binding bindingUsuarioNovo() {
        return BindingBuilder.bind(filaUsuarioNovo()).to(exchangeUsuario()).with(routingKey);
    }
}
