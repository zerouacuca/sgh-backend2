package com.sgh.ms_consulta.listener;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgh.ms_consulta.model.Consulta;
import com.sgh.ms_consulta.model.ConsultaAgendamento;
import com.sgh.ms_consulta.model.StatusAgendamento;
import com.sgh.ms_consulta.repository.ConsultaAgendamentoRepository;
import com.sgh.ms_consulta.repository.ConsultaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class ConsultaEventListener {

    private final ConsultaRepository consultaRepository;
    private final ConsultaAgendamentoRepository agendamentoRepository;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "${sgh.rabbitmq.queue.consulta}")
    public void onConsultaAgendada(String message) {
        try {
            JsonNode json = objectMapper.readTree(message);
            Long pacienteId = json.get("pacienteId").asLong();
            Long consultaId = json.get("consultaId").asLong();

            Consulta consulta = consultaRepository.findById(consultaId)
                    .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

            if (consulta.getVagasDisponiveis() > 0) {
                consulta.setVagasDisponiveis(consulta.getVagasDisponiveis() - 1);
                consultaRepository.save(consulta);

                ConsultaAgendamento agendamento = ConsultaAgendamento.builder()
                        .pacienteId(pacienteId)
                        .consultaId(consultaId)
                        .dataHora(LocalDateTime.now())
                        .status(StatusAgendamento.AGENDADO)
                        .build();

                agendamentoRepository.save(agendamento);

                log.info("Consulta agendada com sucesso: paciente {}, consulta {}", pacienteId, consultaId);
            } else {
                log.warn("Consulta sem vagas disponíveis: {}", consultaId);
                // Aqui poderíamos publicar evento de erro (vaga cheia)
            }
        } catch (Exception e) {
            log.error("Erro ao processar evento de consulta agendada", e);
        }
    }
}
