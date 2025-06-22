package com.sgh.ms_consulta.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultaAgendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pacienteId; // vindo do ms-paciente
    private Long consultaId;

    @Enumerated(EnumType.STRING)
    private StatusAgendamento status; // AGENDADO, CANCELADO

    private LocalDateTime dataHora;
}
