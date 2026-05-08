package com.example.notification.listener;

import com.example.notification.event.EtudiantEvent;
import com.example.notification.event.NoteEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationListener {

    @KafkaListener(topics = "etudiant-created", groupId = "notification-group")
    public void onEtudiantCreated(EtudiantEvent event) {
        log.info("📧 [NOTIFICATION] Nouvel étudiant inscrit : {} (ID: {}). Email de bienvenue simulé envoyé à {}",
                event.getNom(), event.getEtudiantId(), event.getEmail());
    }

    @KafkaListener(topics = "note-created", groupId = "notification-group")
    public void onNoteCreated(NoteEvent event) {
        log.info("📧 [NOTIFICATION] Nouvelle note enregistrée pour l'étudiant ID {} — Matière : {}, Valeur : {}",
                event.getStudentId(), event.getMatiere(), event.getValeur());
    }
}
