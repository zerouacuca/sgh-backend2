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

    @PostMapping("/agendar")
    public ResponseEntity<Consulta> agendar(@RequestBody Consulta consulta) {
        return ResponseEntity.ok(consultaService.agendar(consulta));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Consulta> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.cancelar(id));
    }

    @PutMapping("/{id}/check-in")
    public ResponseEntity<Consulta> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.checkIn(id));
    }

    @PutMapping("/{id}/realizar")
    public ResponseEntity<Consulta> realizar(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.realizar(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consulta> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Consulta>> listarTodas() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }
}