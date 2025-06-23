package com.sgh.ms_consulta.repository;

import com.sgh.ms_consulta.model.Consulta;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByProfissionalId(Long profissionalId);
    List<Consulta> findByEspecialidadeId(Long especialidadeId);
    List<Consulta> findByDataHoraBetween(LocalDateTime start, LocalDateTime end);
}