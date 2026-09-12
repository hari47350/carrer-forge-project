package com.careerforge.model.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ATSResponse {
    private int overallScore;
    private Map<String, Integer> categoryScores; // Keywords, Structure, Content, Completeness, Readability

    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> recommendations;          // general suggestions
    private String summary;

    // 🆕 Detailed analysis fields
    private List<String> strengths;                // what the resume does well
    private List<String> weaknesses;               // areas that need improvement
    private List<String> actionableTips;           // step‑by‑step improvements
    private String templateSuggestion;             // e.g., "Chronological", "Functional", "Combination"
    private List<String> extractedSkills;          // skills identified from the resume
    private String experienceSummary;              // years of experience, key roles
    private String educationSummary;               // degrees, certifications
}