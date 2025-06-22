package com.sgh.ms_consulta.controller;

import com.sgh.ms_consulta.model.ConsultaAgendamento;
import com.sgh.ms_consulta.repository.ConsultaAgendamentoRepository;
import com.sgh.ms_consulta.service.ConsultaAgendamentoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@RequiredArgsConstructor
public class ConsultaAgendamentoController {

    private final ConsultaAgendamentoRepository repository;
    private final ConsultaAgendamentoService agendamentoService;

    // Listar todos os agendamentos
    @GetMapping
    public ResponseEntity<List<ConsultaAgendamento>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Buscar agendamentos por consultaId
    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity<List<ConsultaAgendamento>> listarPorConsulta(@PathVariable Long consultaId) {
        return ResponseEntity.ok(repository.findByConsultaId(consultaId));
    }

    // Buscar agendamentos por pacienteId
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<ConsultaAgendamento>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(repository.findByPacienteId(pacienteId));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<String> cancelarAgendamento(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.cancelarAgendamento(id));
    }

}
