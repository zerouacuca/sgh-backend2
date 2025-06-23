package com.sgh.ms_autenticacao.dto;

import lombok.Data;

@Data
public class NovoUsuarioDTO {
    private String email;
    private String nome;
    private String cpf;
    private String perfil; // se quiser também já incluir aqui, ou pode manter separado
}