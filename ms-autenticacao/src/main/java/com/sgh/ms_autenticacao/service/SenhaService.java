package com.sgh.ms_autenticacao.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class SenhaService {

    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    private static final int TAMANHO_SENHA = 10;

    public String gerarSenhaAleatoria() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(TAMANHO_SENHA);
        for (int i = 0; i < TAMANHO_SENHA; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}