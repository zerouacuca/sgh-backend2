package com.sgh.ms_autenticacao.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgh.ms_autenticacao.model.Perfil;
import com.sgh.ms_autenticacao.model.Usuario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsuarioConsumer {

    private final ObjectMapper objectMapper;
    private final UsuarioService usuarioService;

    @RabbitListener(queues = "${rabbitmq.queue}")
    public void receberMensagem(String mensagem) {
        try {
            JsonNode jsonNode = objectMapper.readTree(mensagem);

            String email = jsonNode.hasNonNull("email") ? jsonNode.get("email").asText() : null;
            String nome = jsonNode.hasNonNull("nome") ? jsonNode.get("nome").asText() : null;
            String cpf = jsonNode.hasNonNull("cpf") ? jsonNode.get("cpf").asText() : null;
            Perfil perfil = jsonNode.hasNonNull("perfil") ? Perfil.valueOf(jsonNode.get("perfil").asText()) : null;

            if (email == null || perfil == null) {
                log.error("Mensagem RabbitMQ inválida: email ou perfil ausente");
                return;
            }

            Usuario usuario = usuarioService.registrarUsuario(email, perfil, nome, cpf);

            log.info("Usuário registrado com sucesso via RabbitMQ: {}", usuario.getEmail());

        } catch (Exception e) {
            log.error("Erro ao processar mensagem RabbitMQ", e);
        }
    }

}
