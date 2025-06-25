package com.sgh.ms_paciente.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgh.ms_paciente.dto.AgendamentoRequest;
import com.sgh.ms_paciente.model.Paciente;
import com.sgh.ms_paciente.model.TransacaoPonto;
import com.sgh.ms_paciente.model.TipoTransacao;
import com.sgh.ms_paciente.repository.PacienteRepository;
import com.sgh.ms_paciente.repository.TransacaoPontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final PacienteRepository pacienteRepository;
    private final TransacaoPontoRepository transacaoPontoRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routingkey.agendamento}")
    private String routingKeyAgendamento;

   @Transactional
    public String agendarConsulta(AgendamentoRequest request) throws JsonProcessingException {
        // Verifica se o paciente existe
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        // Busca a consulta no ms-consulta
        String consultaUrl = "http://ms-consulta:8083/consultas/" + request.getConsultaId();
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> consulta;
        try {
            consulta = restTemplate.getForObject(consultaUrl, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Consulta não encontrada");
        }

        if (consulta == null || !consulta.containsKey("valorEmPontos")) {
            throw new RuntimeException("Valor da consulta não encontrado");
        }

        // Obtém o valor da consulta dinamicamente
        int valorConsulta = (int) consulta.get("valorEmPontos");

        // Verifica saldo
        if (paciente.getSaldoPontos() < valorConsulta) {
            return "Pontos insuficientes para agendar a consulta.";
        }

        // Debita pontos
        paciente.setSaldoPontos(paciente.getSaldoPontos() - valorConsulta);
        pacienteRepository.save(paciente);

        // Registra transação
        TransacaoPonto transacao = TransacaoPonto.builder()
                .paciente(paciente)
                .dataHora(LocalDateTime.now())
                .tipo(TipoTransacao.DEBITO)
                .valor(valorConsulta)
                .origem("Agendamento de consulta ID " + request.getConsultaId())
                .build();
        transacaoPontoRepository.save(transacao);

        // Envia evento de agendamento
        Map<String, Object> evento = new HashMap<>();
        evento.put("pacienteId", paciente.getId());
        evento.put("consultaId", request.getConsultaId());

        String mensagem = objectMapper.writeValueAsString(evento);
        rabbitTemplate.convertAndSend(exchange, routingKeyAgendamento, mensagem);

        return "Agendamento solicitado com sucesso, aguardando confirmação.";
    }
}
