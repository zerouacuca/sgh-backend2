package com.sgh.ms_consulta.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    private Integer totalVagas;

    @Enumerated(EnumType.STRING)
    private StatusConsulta status;

    @ManyToOne
    private Profissional profissional;

    @ManyToOne
    private Especialidade especialidade;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Agendamento> agendamentos;
}