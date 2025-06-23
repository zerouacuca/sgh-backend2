package com.sgh.ms_autenticacao.service;

import com.sgh.ms_autenticacao.model.Perfil;
import com.sgh.ms_autenticacao.model.Usuario;
import com.sgh.ms_autenticacao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HashService hashService;

    @Autowired
    private SenhaService senhaService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;  // <-- injetar aqui

    public Usuario registrarUsuario(String email, Perfil perfil, String nome, String cpf) {
        String senha = senhaService.gerarSenhaAleatoria();
        String salt = hashService.gerarSalt();
        String senhaHash = hashService.hashSenha(senha, salt);

        Usuario usuario = Usuario.builder()
                .email(email)
                .perfil(perfil)
                .salt(salt)
                .senhaHash(senhaHash)
                .nome(nome)
                .cpf(cpf)
                .build();

        usuarioRepository.save(usuario);

        // Enviar e-mail com a senha gerada
        emailService.enviarEmail(email, "Sua senha para acesso ao SGH", "Sua senha temporária é: " + senha);

        return usuario;
    }


    public String login(String email, String senhaDigitada) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String hashDigitado = hashService.hashSenha(senhaDigitada, usuario.getSalt());

        if (!hashDigitado.equals(usuario.getSenhaHash())) {
            throw new RuntimeException("Senha inválida");
        }

        return jwtService.gerarToken(usuario);
    }
}