package com.sgh.ms_paciente.repository;

import com.sgh.ms_paciente.model.TransacaoPonto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoPontoRepository extends JpaRepository<TransacaoPonto, Long> {

    // Buscar transações por paciente, ordenadas pela data decrescente
    List<TransacaoPonto> findByPacienteIdOrderByDataHoraDesc(Long pacienteId);
}
