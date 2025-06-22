package com.sgh.ms_consulta.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgh.ms_consulta.model.Consulta;
import com.sgh.ms_consulta.model.ConsultaAgendamento;
import com.sgh.ms_consulta.model.StatusAgendamento;
import com.sgh.ms_consulta.repository.ConsultaAgendamentoRepository;
import com.sgh.ms_consulta.repository.ConsultaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConsultaAgendamentoService {

    private final ConsultaAgendamentoRepository agendamentoRepository;
    private final ConsultaRepository consultaRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Value("${sgh.rabbitmq.exchange}")
    private String exchange;

    public String cancelarAgendamento(Long agendamentoId) {
        ConsultaAgendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            return "Agendamento já estava cancelado.";
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        agendamentoRepository.save(agendamento);

        Consulta consulta = consultaRepository.findById(agendamento.getConsultaId())
                .orElseThrow(() -> new EntityNotFoundException("Consulta não encontrada"));

        consulta.setVagasDisponiveis(consulta.getVagasDisponiveis() + 1);
        consultaRepository.save(consulta);

        // Publicar evento de reembolso
        Map<String, Object> payload = new HashMap<>();
        payload.put("pacienteId", agendamento.getPacienteId());
        payload.put("consultaId", consulta.getId());
        payload.put("valor", consulta.getValorEmPontos());

        rabbitTemplate.convertAndSend(exchange, "sgh.consulta.cancelada", payload);
        log.info("Evento de cancelamento enviado: {}", payload);

        return "Agendamento cancelado e evento de reembolso enviado.";
    }
}
