package com.sgh.ms_consulta.controller;

import com.sgh.ms_consulta.model.Agendamento;
import com.sgh.ms_consulta.model.Consulta;
import com.sgh.ms_consulta.repository.AgendamentoRepository;
import com.sgh.ms_consulta.service.AgendamentoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {
    
    private final AgendamentoRepository repository;
    private final AgendamentoService agendamentoService;

    // Listar todos os agendamentos
    @GetMapping
    public ResponseEntity<List<Agendamento>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Buscar agendamentos por consultaId
    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity<List<Agendamento>> listarPorConsulta(@PathVariable Long consultaId) {
        return ResponseEntity.ok(repository.findByConsultaId(consultaId));
    }

    // Buscar agendamentos por pacienteId
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Agendamento>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(repository.findByPacienteId(pacienteId));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<String> cancelarAgendamento(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.cancelarAgendamento(id));
    }

    @GetMapping("/consulta/{consultaId}/checkins")
    public ResponseEntity<List<Agendamento>> listarCheckInsPorConsulta(@PathVariable Long consultaId) {
        List<Agendamento> checkins = agendamentoService.listarCheckInsPorConsulta(consultaId);
        return ResponseEntity.ok(checkins);
    }

    @PutMapping("/{id}/confirmar-comparecimento")
    public ResponseEntity<String> confirmarComparecimento(@PathVariable Long id) {
        String mensagem = agendamentoService.confirmarComparecimento(id);
        return ResponseEntity.ok(mensagem);
    }

    @PostMapping("/checkin/{agendamentoId}")
    public ResponseEntity<String> fazerCheckIn(@PathVariable Long agendamentoId) {
        String mensagem = agendamentoService.fazerCheckIn(agendamentoId);
        return ResponseEntity.ok(mensagem);
    }
    
}
