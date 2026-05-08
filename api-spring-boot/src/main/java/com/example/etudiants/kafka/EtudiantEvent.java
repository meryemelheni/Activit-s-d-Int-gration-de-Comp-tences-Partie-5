package com.example.etudiants.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EtudiantEvent {
    private Long etudiantId;
    private String nom;
    private String email;
    private LocalDateTime timestamp;
}
