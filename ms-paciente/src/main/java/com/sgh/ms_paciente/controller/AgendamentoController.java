package com.sgh.ms_paciente.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sgh.ms_paciente.dto.AgendamentoRequest;
import com.sgh.ms_paciente.service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<String> agendar(@RequestBody AgendamentoRequest request) {
        try {
            String resposta = agendamentoService.agendarConsulta(request);
            return ResponseEntity.ok(resposta);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Erro ao processar agendamento.");
        }
    }
}
