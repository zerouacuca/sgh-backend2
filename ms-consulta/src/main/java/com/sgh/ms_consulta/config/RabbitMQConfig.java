package com.sgh.ms_consulta.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${sgh.rabbitmq.exchange}")
    private String exchange;

    @Value("${sgh.rabbitmq.queue.consulta}")
    private String consultaQueue;

    @Value("${sgh.rabbitmq.routingkey.consulta}")
    private String consultaRoutingKey;

    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange(exchange);
    }

    @Bean
    public Queue consultaQueue() {
        return new Queue(consultaQueue, true);
    }

    @Bean
    public Binding bindingConsultaQueue() {
        return BindingBuilder.bind(consultaQueue())
                .to(directExchange())
                .with(consultaRoutingKey);
    }

    @Value("${sgh.rabbitmq.routingkey.cancelamento}")
    private String cancelamentoRoutingKey;

    @Bean
    public Queue consultaCancelamentoQueue() {
        return new Queue("sgh.consulta.cancelada", true);
    }

    @Bean
    public Binding bindingCancelamentoQueue() {
        return BindingBuilder.bind(consultaCancelamentoQueue())
                .to(directExchange())
                .with(cancelamentoRoutingKey);
    }

}
