package com.sgh.ms_autenticacao.controller;

import com.sgh.ms_autenticacao.dto.NovoUsuarioDTO;
import com.sgh.ms_autenticacao.dto.UserInfoResponse;
import com.sgh.ms_autenticacao.model.Perfil;
import com.sgh.ms_autenticacao.service.JwtService;
import com.sgh.ms_autenticacao.service.UsuarioService;
import lombok.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

   @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody NovoUsuarioDTO request) {
        usuarioService.registrarUsuario(
            request.getEmail(), 
            Perfil.valueOf(request.getPerfil()), // converte string para enum, se estiver assim
            request.getNome(), 
            request.getCpf()
        );
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }

    // NOVO ENDPOINT: /auth/userinfo
    @GetMapping("/userinfo")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token JWT ausente ou mal formatado.");
        }

        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

        try {
            UserInfoResponse userInfo = jwtService.extractUserClaims(token);
            return ResponseEntity.ok(userInfo);
        } catch (RuntimeException e) {
            // Captura a exceção lançada pelo JwtService para token inválido/expirado
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = usuarioService.login(request.getEmail(), request.getSenha());
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validarToken(@RequestParam String token) {
        boolean valido = jwtService.validarToken(token);
        return ResponseEntity.ok(valido);
    }

    // DTOs
    @Data
    static class RegistroRequest {
        private String email;
        private Perfil perfil;
    }

    @Data
    static class LoginRequest {
        private String email;
        private String senha;
    }

    @Data
    @AllArgsConstructor
    static class TokenResponse {
        private String token;
    }
}
