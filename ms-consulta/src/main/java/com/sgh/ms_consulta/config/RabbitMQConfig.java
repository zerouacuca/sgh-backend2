package com.sgh.ms_consulta.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
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

    @Value("${sgh.rabbitmq.routingkey.cancelamento}")
    private String cancelamentoRoutingKey;

    // Exchange principal
    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange(exchange);
    }

    // Fila para eventos de nova consulta
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

    // Fila para eventos de cancelamento de consulta
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

    // Conversor de mensagens para JSON
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // Template do RabbitMQ usando conversor JSON
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}