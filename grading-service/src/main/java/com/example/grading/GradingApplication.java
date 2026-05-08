package com.example.grading;

import com.example.grading.event.NoteEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class GradingApplication {

    private final KafkaTemplate<String, NoteEvent> kafkaTemplate;

    public static void main(String[] args) {
        SpringApplication.run(GradingApplication.class, args);
    }

    @PostMapping
    public String createNote(@RequestBody NoteEvent event) {
        kafkaTemplate.send("note-created", event);
        return "Note event published to Kafka";
    }
}
