package com.sgh.ms_consulta.controller;

import com.sgh.ms_consulta.model.Profissional;
import com.sgh.ms_consulta.model.StatusProfissional;
import com.sgh.ms_consulta.service.ProfissionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profissionais")
@RequiredArgsConstructor
public class ProfissionalController {

    private final ProfissionalService profissionalService;

    @PutMapping("/{id}/status")
    public ResponseEntity<String> alterarStatus(@PathVariable Long id, @RequestParam StatusProfissional status) {
        String resposta = profissionalService.alterarStatus(id, status);
        return ResponseEntity.ok(resposta);
    }

    @PostMapping
    public ResponseEntity<Profissional> criar(@RequestBody Profissional profissional) {
        return ResponseEntity.ok(profissionalService.salvar(profissional));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(profissionalService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Profissional>> listarTodos() {
        return ResponseEntity.ok(profissionalService.listarTodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        profissionalService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status")
    public ResponseEntity<StatusProfissional[]> listarStatusProfissional() {
        return ResponseEntity.ok(StatusProfissional.values());
    }
}
