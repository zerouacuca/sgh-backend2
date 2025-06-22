package com.sgh.ms_consulta.service;

import com.sgh.ms_consulta.model.Sala;
import com.sgh.ms_consulta.repository.SalaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaService {

    private final SalaRepository salaRepository;

    public Sala salvar(Sala sala) {
        return salaRepository.save(sala);
    }

    public Sala buscarPorId(Long id) {
        return salaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala não encontrada"));
    }

    public List<Sala> listarTodas() {
        return salaRepository.findAll();
    }

    public void deletar(Long id) {
        salaRepository.deleteById(id);
    }
}
