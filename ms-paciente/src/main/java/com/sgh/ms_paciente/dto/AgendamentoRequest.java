package com.sgh.ms_paciente.dto;

import lombok.Data;

@Data
public class AgendamentoRequest {
    private Long pacienteId;
    private Long consultaId;
}