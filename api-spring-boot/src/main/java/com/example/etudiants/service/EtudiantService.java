package com.example.etudiants.service;

import com.example.etudiants.dto.EtudiantDTO;
import com.example.etudiants.entity.Etudiant;
import com.example.etudiants.exception.ResourceNotFoundException;
import com.example.etudiants.kafka.KafkaProducerService;
import com.example.etudiants.mapper.EtudiantMapper;
import com.example.etudiants.repository.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository repository;
    private final EtudiantMapper mapper;
    private final KafkaProducerService kafkaProducerService;

    // ✅ Cache Redis activé pour tous les étudiants
    @Cacheable(value = "etudiants")
    public List<EtudiantDTO> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Cache Redis activé pour un étudiant par ID
    @Cacheable(value = "etudiants", key = "#id")
    public EtudiantDTO findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'id: " + id));
    }

    // ✅ Invalidation du cache après ajout
    @CacheEvict(value = "etudiants", allEntries = true)
    public EtudiantDTO save(EtudiantDTO dto) {
        Etudiant entity = mapper.toEntity(dto);
        EtudiantDTO savedDto = mapper.toDTO(repository.save(entity));
        kafkaProducerService.publishEtudiantCreated(savedDto);
        return savedDto;
    }

    // ✅ Invalidation du cache après mise à jour
    @CacheEvict(value = "etudiants", allEntries = true)
    public EtudiantDTO update(Long id, EtudiantDTO dto) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec l'id: " + id);
        }
        Etudiant entity = mapper.toEntity(dto);
        entity.setId(id);
        return mapper.toDTO(repository.save(entity));
    }

    // ✅ Invalidation du cache après suppression
    @CacheEvict(value = "etudiants", allEntries = true)
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec l'id: " + id);
        }
        repository.deleteById(id);
    }

    // ✅ Recherche par année
    public List<EtudiantDTO> findByAnnee(int annee) {
        return repository.findByAnneePremiereInscription(annee).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Recherche par département
    public List<EtudiantDTO> findByDepartement(Long departementId) {
        return repository.findByDepartementId(departementId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
