package com.careerforge.controller;

import com.careerforge.model.dto.ATSResponse;
import com.careerforge.service.ATSService;
import com.careerforge.service.ResumeParserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ResumeController {

    private final ATSService atsService;
    private final ResumeParserService resumeParserService;

    @PostMapping("/analyze")
    public ResponseEntity<ATSResponse> analyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription) {

        String resumeText = resumeParserService.parse(file);
        ATSResponse response = atsService.analyze(resumeText, jobDescription);
        return ResponseEntity.ok(response);
    }
}