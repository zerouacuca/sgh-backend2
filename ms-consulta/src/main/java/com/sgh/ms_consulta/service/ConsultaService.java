package com.sgh.ms_consulta.service;

import com.sgh.ms_consulta.model.*;
import com.sgh.ms_consulta.repository.ConsultaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepository;

    public Consulta agendar(Consulta consulta) {
        consulta.setStatus(StatusConsulta.AGENDADA);
        consulta.setDataHora(LocalDateTime.now()); // Pode ser alterado conforme entrada
        return consultaRepository.save(consulta);
    }

    public Consulta cancelar(Long id) {
        Consulta consulta = buscarPorId(id);
        consulta.setStatus(StatusConsulta.CANCELADA);
        return consultaRepository.save(consulta);
    }

    public Consulta checkIn(Long id) {
        Consulta consulta = buscarPorId(id);
        consulta.setStatus(StatusConsulta.CHECK_IN);
        return consultaRepository.save(consulta);
    }

    public Consulta realizar(Long id) {
        Consulta consulta = buscarPorId(id);
        consulta.setStatus(StatusConsulta.REALIZADA);
        return consultaRepository.save(consulta);
    }

    public Consulta buscarPorId(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta não encontrada"));
    }

    public List<Consulta> listarTodas() {
        return consultaRepository.findAll();
    }
}