package com.sgh.ms_consulta.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pacienteId; // vindo do ms-paciente

    @ManyToOne
    @JoinColumn(name = "consulta_id")
    @JsonBackReference
    private Consulta consulta;

    @Enumerated(EnumType.STRING)
    private StatusAgendamento status;

    private LocalDateTime dataHora;
}