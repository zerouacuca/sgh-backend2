package com.sgh.ms_autenticacao.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgh.ms_autenticacao.model.Perfil;
import com.sgh.ms_autenticacao.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioConsumer {

    private final ObjectMapper objectMapper;
    private final UsuarioService usuarioService;

    @RabbitListener(queues = "${rabbitmq.queue}")
    public void receberMensagem(String mensagem) {
        try {
            JsonNode jsonNode = objectMapper.readTree(mensagem);
            String email = jsonNode.get("email").asText();

            Usuario usuario = usuarioService.registrarUsuario(email, Perfil.PACIENTE);

            System.out.println("Usuário registrado com sucesso via RabbitMQ: " + usuario.getEmail());

        } catch (Exception e) {
            System.err.println("Erro ao processar mensagem RabbitMQ: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
