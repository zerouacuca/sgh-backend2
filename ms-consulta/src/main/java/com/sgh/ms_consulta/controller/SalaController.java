package com.sgh.ms_consulta.controller;

import com.sgh.ms_consulta.model.Sala;
import com.sgh.ms_consulta.service.SalaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaService salaService;

    @PostMapping
    public ResponseEntity<Sala> criar(@RequestBody Sala sala) {
        return ResponseEntity.ok(salaService.salvar(sala));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sala> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(salaService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Sala>> listarTodas() {
        return ResponseEntity.ok(salaService.listarTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        salaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
