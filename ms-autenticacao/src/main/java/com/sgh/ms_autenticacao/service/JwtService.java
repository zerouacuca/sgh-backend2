package com.sgh.ms_autenticacao.service;

import com.sgh.ms_autenticacao.model.Usuario;
import com.sgh.ms_autenticacao.dto.UserInfoResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Importar para tratamento de erro específico
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey; // Usar SecretKey para o tipo da chave
import java.nio.charset.StandardCharsets; // Importar para garantir a codificação correta
import java.util.Date;

@Service
public class JwtService {

    // **IMPORTANTE**: Carregue esta chave de uma variável de ambiente ou configuração externa.
    // NUNCA deixe uma chave secreta hardcoded em produção!
    // Para HS256, a chave deve ter no mínimo 32 bytes (256 bits).
    // Esta string tem 42 caracteres, o que a torna segura para HS256 se cada caractere for 1 byte.
    private final String SECRET_STRING = "uma-chave-super-secreta-para-seu-jwt-sgh-256bits-segura";
    private final long EXPIRACAO = 1000 * 60 * 60 * 24; // 24 horas

    // A chave JWT agora será do tipo SecretKey
    private SecretKey key;

    // Construtor para inicializar a chave de forma segura
    public JwtService() {
        // Gera a chave a partir da string secreta, garantindo que seja forte o suficiente para HS256
        // Isso converte a string para bytes usando UTF-8 (padrão)
        // e garante que a chave resultante atenda aos requisitos de bits.
        this.key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));

        // Opcional: Se você quer gerar uma chave randômica e segura a cada inicialização (apenas para DEV/TESTE)
        // e não se importa com a persistência da chave entre reinícios do serviço:
        // this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        // Se você usasse esta opção, o SECRET_STRING não seria necessário.
    }

    private SecretKey getKey() {
        return this.key; // Retorna a chave inicializada no construtor
    }

    // O método gerarToken agora recebe um objeto Usuario, que é mais robusto
    public String gerarToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("perfil", usuario.getPerfil().name()) // Salva o nome do ENUM Perfil
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRACAO))
                .signWith(getKey(), SignatureAlgorithm.HS256) // HS256 é o algoritmo padrão e mais comum
                .compact();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            // Logar ou tratar especificamente tokens com assinatura inválida/corrompida
            System.err.println("Assinatura do token inválida: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            // Captura outras exceções de JWT (expiração, malformado, etc.)
            System.err.println("Token inválido: " + e.getMessage());
            return false;
        }
    }

    public String getEmailDoToken(String token) {
        try {
            return Jwts.parserBuilder()
                       .setSigningKey(getKey())
                       .build()
                       .parseClaimsJws(token)
                       .getBody()
                       .getSubject();
        } catch (JwtException e) {
            System.err.println("Erro ao obter email do token: " + e.getMessage());
            throw new RuntimeException("Token inválido ou expirado.", e);
        }
    }

    // NOVO MÉTODO: Extrai email e perfil do token para o endpoint /userinfo
    public UserInfoResponse extractUserClaims(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                                .setSigningKey(getKey())
                                .build()
                                .parseClaimsJws(token)
                                .getBody();

            String email = claims.getSubject(); // O email é o "subject" (assunto)
            String perfil = claims.get("perfil", String.class); // Extrai a claim "perfil" como String

            if (email == null || perfil == null) {
                // Isso pode acontecer se o token não tiver as claims esperadas
                throw new IllegalArgumentException("Email ou perfil não encontrados no token.");
            }

            return new UserInfoResponse(email, perfil);

        } catch (SignatureException | io.jsonwebtoken.MalformedJwtException | io.jsonwebtoken.ExpiredJwtException | IllegalArgumentException e) {
            // Lidar com exceções de token inválido/expirado/malformado
            System.err.println("Erro ao extrair claims do token: " + e.getMessage());
            throw new RuntimeException("Token inválido ou expirado.", e); // Lança uma RuntimeException para ser capturada no Controller
        }
    }
}