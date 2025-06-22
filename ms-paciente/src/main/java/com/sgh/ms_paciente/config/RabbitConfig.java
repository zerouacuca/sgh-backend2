package com.sgh.ms_paciente.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean
    public RabbitTemplate rabbitTemplate(org.springframework.amqp.rabbit.connection.ConnectionFactory connectionFactory) {
        return new RabbitTemplate(connectionFactory);
    }

    @Value("${rabbitmq.queue.cancelamento}")
    private String cancelamentoQueue;

    @Value("${rabbitmq.routingkey.cancelamento}")
    private String cancelamentoRoutingKey;


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

    @Bean
    public Queue filaConsultaCancelada() {
        return new Queue(cancelamentoQueue, true);
    }

    @Bean
    public Binding bindingConsultaCancelada() {
        return BindingBuilder
                .bind(filaConsultaCancelada())
                .to(exchangeUsuario()) // Reutilizando o mesmo exchange
                .with(cancelamentoRoutingKey);
    }

}
