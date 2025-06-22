package com.sgh.ms_consulta.repository;

import com.sgh.ms_consulta.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
}