package com.example.grading.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteEvent {
    private Long studentId;
    private String matiere;
    private Double valeur;
}
