package com.sgh.ms_consulta.service;

import java.util.Map;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

import com.sgh.ms_consulta.model.*;
import com.sgh.ms_consulta.repository.AgendamentoRepository;
import com.sgh.ms_consulta.repository.ConsultaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final RabbitTemplate rabbitTemplate;

    @Value("${sgh.rabbitmq.exchange}")
    private String exchange;

    private final ConsultaRepository consultaRepository;
    private final AgendamentoRepository agendamentoRepository;

    public Consulta criarConsulta(Consulta consulta) {
        consulta.setStatus(StatusConsulta.DISPONÍVEL);
        consulta.setTotalVagas(consulta.getVagasDisponiveis());
        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarConsultasProximas48h() {
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime daqui48h = agora.plusHours(48);
        return consultaRepository.findByDataHoraBetween(agora, daqui48h);
    }

    @Transactional
    public Consulta cancelar(Long id) {
        Consulta consulta = buscarPorId(id);

        List<Agendamento> agendamentos = agendamentoRepository.findByConsultaId(consulta.getId());

        if (agendamentos == null || agendamentos.isEmpty()) {
            throw new IllegalStateException("Não é possível cancelar uma consulta sem agendamentos.");
        }

        // Conta os agendamentos confirmados (CHECKIN ou COMPARECEU)
        long confirmados = agendamentos.stream()
                .filter(a -> a.getStatus() == StatusAgendamento.CHECKIN || a.getStatus() == StatusAgendamento.COMPARECEU)
                .count();

        int totalVagas = Optional.ofNullable(consulta.getTotalVagas()).orElse(0);

        if (totalVagas == 0) {
            throw new IllegalStateException("Total de vagas não definido. Cancelamento não pode ser avaliado.");
        }

        double percentualConfirmados = (double) confirmados / totalVagas;

        if (percentualConfirmados >= 0.5) {
            throw new IllegalStateException("A consulta não pode ser cancelada pois 50% ou mais das vagas estão confirmadas.");
        }

        // Cancela a consulta
        consulta.setStatus(StatusConsulta.CANCELADA);
        Integer valor = Optional.ofNullable(consulta.getValorEmPontos()).orElse(0);

        for (Agendamento agendamento : agendamentos) {
            agendamento.setStatus(StatusAgendamento.CANCELADO);
            agendamentoRepository.save(agendamento);

            Map<String, Object> payload = Map.of(
                "pacienteId", agendamento.getPacienteId(),
                "valor", valor,
                "consultaId", consulta.getId(),
                "motivo", "Consulta cancelada pelo sistema",
                "origem", "ms-consulta"
            );

            rabbitTemplate.convertAndSend(exchange, "sgh.consulta.reembolso", payload);
            log.info("Evento de reembolso enviado para paciente {}: {}", agendamento.getPacienteId(), payload);
        }

        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarConsultasSemAgendamentoPorPaciente(Long pacienteId) {
        return consultaRepository.findConsultasDisponiveisParaPaciente(pacienteId);
    }

    @Transactional
    public Consulta finalizarConsulta(Long id) {
        Consulta consulta = buscarPorId(id); // método auxiliar que lança exceção se não encontrar
        consulta.setStatus(StatusConsulta.REALIZADA);

        List<Agendamento> agendamentos = consulta.getAgendamentos();
        if (agendamentos != null && !agendamentos.isEmpty()) {
            for (Agendamento agendamento : agendamentos) {
                if (agendamento.getStatus() == StatusAgendamento.COMPARECEU) {
                    agendamento.setStatus(StatusAgendamento.REALIZADO);
                } else if (agendamento.getStatus() != StatusAgendamento.CANCELADO) {
                    agendamento.setStatus(StatusAgendamento.FALTOU);
                }
            }
        }

        return consultaRepository.save(consulta);
    }

    public Consulta buscarPorId(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta não encontrada"));
    }

    public List<Consulta> listarTodas() {
        return consultaRepository.findAll();
    }

    public List<Consulta> listarPorProfissional(Long profissionalId) {
        return consultaRepository.findByProfissionalId(profissionalId);
    }

    public List<Consulta> listarPorEspecialidade(Long especialidadeId) {
        return consultaRepository.findByEspecialidadeId(especialidadeId);
    }

}