package com.sgh.ms_consulta.repository;

import com.sgh.ms_consulta.model.ConsultaAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaAgendamentoRepository extends JpaRepository<ConsultaAgendamento, Long> {
    List<ConsultaAgendamento> findByConsultaId(Long consultaId);
    List<ConsultaAgendamento> findByPacienteId(Long pacienteId);
}