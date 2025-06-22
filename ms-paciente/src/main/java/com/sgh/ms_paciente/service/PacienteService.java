package com.sgh.ms_paciente.service;

import com.sgh.ms_paciente.model.Paciente;
import com.sgh.ms_paciente.model.TransacaoPonto;
import com.sgh.ms_paciente.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final RabbitMQSenderService rabbitMQSenderService;

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public Paciente buscarPorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado"));
    }

    public Optional<Paciente> buscarPorCpf(String cpf) {
        return pacienteRepository.findByCpf(cpf);
    }

    public Optional<Paciente> buscarPorEmail(String email) {
        return pacienteRepository.findByEmail(email);
    }

    public Paciente salvar(Paciente paciente) {
        Paciente salvo = pacienteRepository.save(paciente);
        rabbitMQSenderService.sendUsuarioNovo(salvo);
        return salvo;
    }

    public Paciente atualizar(Long id, Paciente dadosAtualizados) {
        Paciente paciente = buscarPorId(id);

        paciente.setNome(dadosAtualizados.getNome());
        paciente.setEmail(dadosAtualizados.getEmail());
        paciente.setEndereco(dadosAtualizados.getEndereco());
        return pacienteRepository.save(paciente);
    }

    public void deletar(Long id) {
        pacienteRepository.deleteById(id);
    }

    public Paciente adicionarTransacao(Long pacienteId, TransacaoPonto transacao) {
        Paciente paciente = buscarPorId(pacienteId);

        if (transacao.getTipo().equalsIgnoreCase("credito")) {
            paciente.setSaldoPontos(paciente.getSaldoPontos() + transacao.getValor());
        } else if (transacao.getTipo().equalsIgnoreCase("debito")) {
            paciente.setSaldoPontos(paciente.getSaldoPontos() - transacao.getValor());
        }

        transacao.setDataHora(LocalDateTime.now());
        transacao.setPaciente(paciente);
        paciente.getTransacoes().add(transacao);

        return pacienteRepository.save(paciente);
    }
}
