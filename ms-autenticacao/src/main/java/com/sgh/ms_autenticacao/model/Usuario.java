package com.sgh.ms_autenticacao.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    private String salt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;

    // outros campos se desejar, ex: nome, etc
}
