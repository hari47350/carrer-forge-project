package com.careerforge.controller;

import com.careerforge.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/interview")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class InterviewController {

    private final GeminiService geminiService;

    @PostMapping("/questions")
    public ResponseEntity<Map<String, Object>> generateQuestions(@RequestBody Map<String, String> payload) {
        String jobDesc = payload.get("jobDescription");
        String prompt = "Generate 5 interview questions (mix of behavioral and technical) for a candidate applying for this role:\n" + jobDesc + 
                        "\nReturn as a JSON array of strings.";
        String questionsJson = geminiService.generateText(prompt);
        // Parse JSON (simple – you can use ObjectMapper)
        return ResponseEntity.ok(Map.of("questions", questionsJson));
    }
}