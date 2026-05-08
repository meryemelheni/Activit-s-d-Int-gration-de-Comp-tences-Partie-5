package com.example.etudiants.kafka;

import com.example.etudiants.dto.EtudiantDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private final KafkaTemplate<String, EtudiantEvent> kafkaTemplate;

    public void publishEtudiantCreated(EtudiantDTO etudiant) {
        EtudiantEvent event = EtudiantEvent.builder()
                .etudiantId(etudiant.getId())
                .nom(etudiant.getNom())
                .email(etudiant.getEmail())
                .timestamp(LocalDateTime.now())
                .build();
        kafkaTemplate.send("etudiant-created", event);
    }
}
