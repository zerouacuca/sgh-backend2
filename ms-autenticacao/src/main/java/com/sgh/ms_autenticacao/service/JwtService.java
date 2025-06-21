package com.sgh.ms_autenticacao.service;

import com.sgh.ms_autenticacao.model.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "sua-chave-secreta-ultrasecreta-sgh-256bits";
    private final long EXPIRACAO = 1000 * 60 * 60 * 24; // 24 horas

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String gerarToken(Usuario usuario) {
        return Jwts.builder()
            .setSubject(usuario.getEmail())
            .claim("perfil", usuario.getPerfil().name())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRACAO))
            .signWith(getKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String getEmailDoToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody().getSubject();
    }
}
