package com.sgh.ms_paciente.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

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
                .to(exchangeUsuario())
                .with(cancelamentoRoutingKey);
    }

    // 🔄 Converte JSON automaticamente em DTOs
    @Bean
    public MessageConverter jsonMessageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    // 🛠️ Aplica o conversor no container dos listeners
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter messageConverter
    ) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        return factory;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}