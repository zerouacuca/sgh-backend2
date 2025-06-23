package com.sgh.ms_consulta.repository;

import com.sgh.ms_consulta.model.Agendamento;
import com.sgh.ms_consulta.model.StatusAgendamento;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByConsultaId(Long consultaId);
    List<Agendamento> findByPacienteId(Long pacienteId);
    List<Agendamento> findByConsultaIdAndStatus(Long consultaId, StatusAgendamento status);
}