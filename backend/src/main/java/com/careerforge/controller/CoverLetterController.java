package com.careerforge.controller;

import com.careerforge.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/cover-letter")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CoverLetterController {

    private final GeminiService geminiService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generate(@RequestBody GenerateRequest request) {
        String prompt = buildCoverLetterPrompt(request.getUserName(), request.getJobTitle(), request.getCompany(), request.getJobDescription());
        String letter = geminiService.generateText(prompt);
        return ResponseEntity.ok(Map.of("coverLetter", letter));
    }

    private String buildCoverLetterPrompt(String userName, String jobTitle, String company, String jobDesc) {
        return "Write a professional cover letter for " + userName + " applying for " + jobTitle + 
               " at " + company + ". The job description: " + jobDesc + 
               ". Make it concise, confident, and tailored.";
    }

    static class GenerateRequest {
        private String userName;
        private String jobTitle;
        private String company;
        private String jobDescription;

        // getters and setters
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getJobTitle() { return jobTitle; }
        public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getJobDescription() { return jobDescription; }
        public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    }
}