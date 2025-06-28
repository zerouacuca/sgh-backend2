package com.sgh.ms_consulta.repository;

import com.sgh.ms_consulta.model.Consulta;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByProfissionalId(Long profissionalId);
    List<Consulta> findByEspecialidadeId(Long especialidadeId);
    List<Consulta> findByDataHoraBetween(LocalDateTime start, LocalDateTime end);
    @Query("SELECT c FROM Consulta c WHERE c.id NOT IN (" +
           "SELECT a.consulta.id FROM Agendamento a WHERE a.pacienteId = :pacienteId)")
    List<Consulta> findConsultasSemAgendamentoPorPaciente(@Param("pacienteId") Long pacienteId);
}