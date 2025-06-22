package com.sgh.ms_consulta.service;

import com.sgh.ms_consulta.model.Profissional;
import com.sgh.ms_consulta.repository.ProfissionalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfissionalService {

    private final ProfissionalRepository profissionalRepository;

    public Profissional salvar(Profissional profissional) {
        return profissionalRepository.save(profissional);
    }

    public Profissional buscarPorId(Long id) {
        return profissionalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profissional não encontrado"));
    }

    public List<Profissional> listarTodos() {
        return profissionalRepository.findAll();
    }

    public void deletar(Long id) {
        profissionalRepository.deleteById(id);
    }
}
