package com.careerforge.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public String generateText(String prompt) {
        log.info("📡 Gemini API called. Key starts with: {}",
                apiKey != null && apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "NULL_OR_EMPTY");
        log.info("📡 Prompt length: {} chars", prompt.length());

        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            throw new RuntimeException("Gemini API key is not configured. Check your .env file.");
        }

        try {
            // Build request body
            String requestBody = objectMapper.writeValueAsString(
                java.util.Map.of("contents",
                    java.util.List.of(
                        java.util.Map.of("parts",
                            java.util.List.of(java.util.Map.of("text", prompt))
                        )
                    )
                )
            );

            log.debug("📡 Request body: {}", requestBody.substring(0, Math.min(200, requestBody.length())));

            // Call Gemini API
            String response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                            log.error("❌ Gemini error response: {}", errorBody);
                            return Mono.error(new RuntimeException("Gemini API error: " + errorBody));
                        })
                    )
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            log.info("📡 Gemini raw response length: {} chars", response != null ? response.length() : 0);

            if (response == null || response.isEmpty()) {
                throw new RuntimeException("Empty response from Gemini");
            }

            // Extract text from response
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String text = textNode.asText();

            if (text == null || text.isEmpty()) {
                log.error("❌ Could not extract text. Full response: {}", response);
                throw new RuntimeException("Could not extract text from Gemini response");
            }

            log.info("✅ Gemini response extracted successfully ({} chars)", text.length());
            return text;

        } catch (Exception e) {
            log.error("❌ Gemini call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Gemini call failed: " + e.getMessage());
        }
    }
}