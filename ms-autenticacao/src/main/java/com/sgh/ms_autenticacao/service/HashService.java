package com.sgh.ms_autenticacao.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class HashService {

    public String gerarSalt() {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public String hashSenha(String senha, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String senhaComSalt = senha + salt;
            byte[] hash = md.digest(senhaComSalt.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash da senha", e);
        }
    }
}
