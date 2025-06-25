package com.sgh.ms_paciente.listener;

import com.sgh.ms_paciente.dto.EventoCancelamentoConsultaDTO;
import com.sgh.ms_paciente.model.Paciente;
import com.sgh.ms_paciente.model.TipoTransacao;
import com.sgh.ms_paciente.model.TransacaoPonto;
import com.sgh.ms_paciente.repository.PacienteRepository;
import com.sgh.ms_paciente.repository.TransacaoPontoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class ConsultaCanceladaListener {

    private final PacienteRepository pacienteRepository;
    private final TransacaoPontoRepository transacaoPontoRepository;

    @RabbitListener(queues = "${rabbitmq.queue.cancelamento}")
    @Transactional
    public void onConsultaCancelada(EventoCancelamentoConsultaDTO dto) {
        try {
            if ("ms-consulta".equals(dto.getOrigem())) {
                log.warn("🔁 Reembolso ignorado (já processado ou origem de reembolso em massa): {}", dto);
                return;
            }

            Long pacienteId = dto.getPacienteId();
            Integer valor = dto.getValor();
            Long consultaId = dto.getConsultaId();

            Paciente paciente = pacienteRepository.findById(pacienteId)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            paciente.setSaldoPontos(paciente.getSaldoPontos() + valor);
            pacienteRepository.save(paciente);

            TransacaoPonto reembolso = TransacaoPonto.builder()
                    .paciente(paciente)
                    .dataHora(LocalDateTime.now())
                    .tipo(TipoTransacao.REEMBOLSO)
                    .valor(valor)
                    .origem("Reembolso de cancelamento de consulta ID " + consultaId)
                    .build();

            transacaoPontoRepository.save(reembolso);

            log.info("✅ Reembolso de {} pontos feito para paciente {} (consulta {})", valor, pacienteId, consultaId);

        } catch (Exception e) {
            log.error("❌ Erro ao processar evento de cancelamento de consulta", e);
        }
    }
}