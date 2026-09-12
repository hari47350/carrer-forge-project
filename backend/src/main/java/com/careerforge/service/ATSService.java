package com.careerforge.service;

import com.careerforge.model.dto.ATSResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ATSService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public ATSResponse analyze(String resumeText, String jobDescription) {
        log.info("🔍 Starting ATS analysis. Resume length: {}, JD length: {}",
                resumeText.length(), jobDescription.length());

        String response = null;
        try {
            String prompt = buildPrompt(resumeText, jobDescription);
            response = geminiService.generateText(prompt);

            log.info("📄 Raw Gemini response (first 500 chars): {}",
                    response.substring(0, Math.min(500, response.length())));

            String json = extractJson(response);

            log.info("📄 Extracted JSON (first 500 chars): {}",
                    json.substring(0, Math.min(500, json.length())));

            ATSResponse result = objectMapper.readValue(json, ATSResponse.class);
            log.info("✅ Real ATS analysis completed. Score: {}", result.getOverallScore());
            return result;

        } catch (Exception e) {
            log.error("❌ Gemini analysis failed: {}", e.getMessage());
            log.error("❌ Full stack trace:", e);
            log.error("❌ Raw response was: {}", response);
            return getFallbackResponse();
        }
    }

    private String extractJson(String raw) {
        if (raw == null) return "{}";

        String s = raw.trim();

        if (s.contains("```json")) {
            s = s.substring(s.indexOf("```json") + 7);
        } else if (s.contains("```")) {
            s = s.substring(s.indexOf("```") + 3);
        }
        if (s.contains("```")) {
            s = s.substring(0, s.indexOf("```"));
        }
        s = s.trim();

        int start = s.indexOf('{');
        int end = s.lastIndexOf('}');

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException("No valid JSON object found in Gemini response");
        }

        return s.substring(start, end + 1);
    }

    private String buildPrompt(String resumeText, String jobDescription) {
        if (resumeText.length() > 8000) {
            resumeText = resumeText.substring(0, 8000);
        }
        if (jobDescription.length() > 4000) {
            jobDescription = jobDescription.substring(0, 4000);
        }

        return """
        You are an expert ATS analyzer. Analyze this resume against the job description.
        Return ONLY a raw JSON object. Do NOT wrap it in markdown. Do NOT add explanations.

        RESUME:
        """ + resumeText + """

        JOB DESCRIPTION:
        """ + jobDescription + """

        Return EXACTLY this JSON structure (no additional fields):
        {
            "overallScore": 75,
            "categoryScores": {"Keywords": 80, "Structure": 70, "Content": 75, "Completeness": 70, "Readability": 80},
            "matchedKeywords": ["skill1", "skill2"],
            "missingKeywords": ["skill3", "skill4"],
            "recommendations": ["suggestion 1", "suggestion 2"],
            "summary": "One sentence about this resume",
            "strengths": ["strength 1", "strength 2"],
            "weaknesses": ["weakness 1", "weakness 2"],
            "actionableTips": ["tip 1", "tip 2"],
            "templateSuggestion": "Chronological",
            "extractedSkills": ["skill1", "skill2"],
            "experienceSummary": "X years in Y role",
            "educationSummary": "Degree from University"
        }

        Base everything on THIS resume's actual content. Start with {
        """;
    }

    private ATSResponse getFallbackResponse() {
        return ATSResponse.builder()
                .overallScore(0)
                .categoryScores(Map.of())
                .matchedKeywords(List.of())
                .missingKeywords(List.of())
                .recommendations(List.of("AI analysis failed. Check backend logs."))
                .summary("Analysis unavailable — see backend logs for the exact error.")
                .strengths(List.of())
                .weaknesses(List.of())
                .actionableTips(List.of("Check Gemini logs in backend terminal"))
                .templateSuggestion("N/A")
                .extractedSkills(List.of())
                .experienceSummary("N/A")
                .educationSummary("N/A")
                .build();
    }
}