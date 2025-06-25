package com.sgh.ms_paciente.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventoCancelamentoConsultaDTO {
    private Long pacienteId;
    private Integer valor;
    private Long consultaId;
    private String origem;
}
