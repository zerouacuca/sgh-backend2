package com.sgh.ms_autenticacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInfoResponse {
    private String email;
    private String perfil; // Ou Perfil perfil; se preferir o enum diretamente
}