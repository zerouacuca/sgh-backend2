package com.sgh.ms_consulta.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;

    private Integer valorEmPontos;
    private Integer vagasDisponiveis;

    @Enumerated(EnumType.STRING)
    private StatusConsulta status;

    @ManyToOne
    private Profissional profissional;

    @ManyToOne
    private Sala sala;

    @ManyToOne
    private Especialidade especialidade;
}