package com.sgh.ms_consulta.service;

import com.sgh.ms_consulta.model.Consulta;
import com.sgh.ms_consulta.model.Agendamento;
import com.sgh.ms_consulta.model.StatusAgendamento;
import com.sgh.ms_consulta.repository.AgendamentoRepository;
import com.sgh.ms_consulta.repository.ConsultaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ConsultaRepository consultaRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${sgh.rabbitmq.exchange}")
    private String exchange;

    @Transactional
    public String fazerCheckIn(Long agendamentoId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
            .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));

        if (!StatusAgendamento.CRIADO.equals(agendamento.getStatus())) {
            throw new IllegalStateException("Check-in só pode ser feito para agendamentos com status CRIADO.");
        }

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime dataHoraConsulta = agendamento.getDataHora();

        if (dataHoraConsulta == null) {
            throw new IllegalStateException("Data e hora da consulta não estão definidas.");
        }

        Duration duracao = Duration.between(agora, dataHoraConsulta);
        long horasFaltando = duracao.toHours();

        if (horasFaltando <= 48 && horasFaltando >= 0) {
            agendamento.setStatus(StatusAgendamento.CHECKIN);
            agendamentoRepository.save(agendamento);
            return "Check-in realizado com sucesso.";
        } else {
            throw new IllegalStateException("Check-in só pode ser feito entre 0 e 48 horas antes da consulta.");
        }
    }

    public List<Agendamento> listarCheckInsPorConsulta(Long consultaId) {
        return agendamentoRepository.findByConsultaIdAndStatus(consultaId, StatusAgendamento.CHECKIN);
    }
    
    @Transactional
    public String cancelarAgendamento(Long agendamentoId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
            .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));

        if (StatusAgendamento.CRIADO.equals(agendamento.getStatus()) ||
            StatusAgendamento.CHECKIN.equals(agendamento.getStatus())) {

            agendamento.setStatus(StatusAgendamento.CANCELADO);
            agendamentoRepository.save(agendamento);

            Consulta consulta = agendamento.getConsulta();
            if (consulta == null) {
                throw new EntityNotFoundException("Consulta associada ao agendamento não encontrada.");
            }

            Integer vagasAtual = Optional.ofNullable(consulta.getVagasDisponiveis()).orElse(0);
            consulta.setVagasDisponiveis(vagasAtual + 1);
            consultaRepository.save(consulta);

            Map<String, Object> payload = Map.of(
                "pacienteId", agendamento.getPacienteId(),
                "consultaId", consulta.getId(),
                "valor", consulta.getValorEmPontos()
            );

            rabbitTemplate.convertAndSend(exchange, "sgh.consulta.cancelada", payload);
            log.info("Evento de cancelamento de agendamento ID={} enviado: {}", agendamentoId, payload);

            return "Agendamento cancelado e evento de reembolso enviado.";
        } else {
            throw new IllegalStateException("Agendamento não pode ser cancelado pois está no status: " + agendamento.getStatus());
        }
    }

    @Transactional
    public String confirmarComparecimento(Long agendamentoId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
            .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));

        if (agendamento.getStatus() != StatusAgendamento.CHECKIN) {
            throw new IllegalStateException("Comparecimento só pode ser confirmado para agendamentos com status CHECKIN.");
        }

        agendamento.setStatus(StatusAgendamento.COMPARECEU);
        agendamentoRepository.save(agendamento);

        return "Comparecimento confirmado com sucesso.";
    }

}
