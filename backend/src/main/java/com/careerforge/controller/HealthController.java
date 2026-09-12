package com.careerforge.controller;

import com.careerforge.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final GeminiService geminiService;

    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "CareerForge Backend",
            "version", "1.0.0"
        ));
    }

    @GetMapping("/gemini-test")
    public ResponseEntity<String> testGemini() {
        try {
            String result = geminiService.generateText("Say hello in exactly 5 words.");
            return ResponseEntity.ok("✅ Gemini works: " + result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Gemini failed: " + e.getMessage());
        }
    }
}