package com.sgh.ms_consulta.service;

import com.sgh.ms_consulta.model.Especialidade;
import com.sgh.ms_consulta.repository.EspecialidadeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EspecialidadeService {

    private final EspecialidadeRepository especialidadeRepository;

    public Especialidade salvar(Especialidade especialidade) {
        return especialidadeRepository.save(especialidade);
    }

    public Especialidade buscarPorId(Long id) {
        return especialidadeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Especialidade não encontrada"));
    }

    public List<Especialidade> listarTodas() {
        return especialidadeRepository.findAll();
    }

    public void deletar(Long id) {
        especialidadeRepository.deleteById(id);
    }
}
