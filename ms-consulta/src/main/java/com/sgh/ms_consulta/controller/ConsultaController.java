package com.sgh.ms_consulta.controller;

import com.sgh.ms_consulta.model.Consulta;
import com.sgh.ms_consulta.service.ConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultas")
@RequiredArgsConstructor
public class ConsultaController {

    private final ConsultaService consultaService;

    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<Consulta>> listarPorProfissional(@PathVariable Long profissionalId) {
        List<Consulta> consultas = consultaService.listarPorProfissional(profissionalId);
        return ResponseEntity.ok(consultas);
    }

    @GetMapping("/especialidade/{especialidadeId}")
    public ResponseEntity<List<Consulta>> listarPorEspecialidade(@PathVariable Long especialidadeId) {
        List<Consulta> consultas = consultaService.listarPorEspecialidade(especialidadeId);
        return ResponseEntity.ok(consultas);
    }

    @PostMapping("/criar")
    public ResponseEntity<Consulta> criar(@RequestBody Consulta consulta) {
        return ResponseEntity.ok(consultaService.criarConsulta(consulta));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Consulta> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.cancelar(id));
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<Consulta> finalizar(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.finalizarConsulta(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consulta> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Consulta>> listarTodas() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    // Endpoint para listar consultas nas próximas 48 horas
    @GetMapping("/proximas48h")
    public ResponseEntity<List<Consulta>> listarConsultasProximas48h() {
        List<Consulta> consultas = consultaService.listarConsultasProximas48h();
        return ResponseEntity.ok(consultas);
    }

    
}