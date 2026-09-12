package com.careerforge.controller;

import com.careerforge.model.entity.Application;
import com.careerforge.model.entity.Application.ApplicationStatus;
import com.careerforge.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Application> createApplication(
            Authentication authentication,
            @RequestBody CreateApplicationRequest request) {
        String email = authentication.getName();
        UUID userId = getUserIdByEmail(email); // Simplified - you'd implement this
        Application application = applicationService.createApplication(
            userId,
            request.getJobId(),
            request.getMatchScore(),
            request.getNotes()
        );
        return ResponseEntity.ok(application);
    }

    @GetMapping
    public ResponseEntity<List<Application>> getUserApplications(Authentication authentication) {
        String email = authentication.getName();
        UUID userId = getUserIdByEmail(email); // Simplified
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        ApplicationStatus status = ApplicationStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<ApplicationStatus, Long>> getStats(Authentication authentication) {
        String email = authentication.getName();
        UUID userId = getUserIdByEmail(email); // Simplified
        return ResponseEntity.ok(Map.of(
            ApplicationStatus.APPLIED, applicationService.getApplicationCountByStatus(userId, ApplicationStatus.APPLIED),
            ApplicationStatus.REVIEWING, applicationService.getApplicationCountByStatus(userId, ApplicationStatus.REVIEWING),
            ApplicationStatus.INTERVIEW, applicationService.getApplicationCountByStatus(userId, ApplicationStatus.INTERVIEW),
            ApplicationStatus.OFFER, applicationService.getApplicationCountByStatus(userId, ApplicationStatus.OFFER),
            ApplicationStatus.REJECTED, applicationService.getApplicationCountByStatus(userId, ApplicationStatus.REJECTED)
        ));
    }

    // Simplified method - would use JWT claims in production
    private UUID getUserIdByEmail(String email) {
        // You should implement this properly with your UserRepository
        // For now, returning a dummy UUID
        return UUID.fromString("00000000-0000-0000-0000-000000000001");
    }

    public static class CreateApplicationRequest {
        private UUID jobId;
        private Integer matchScore;
        private String notes;

        public UUID getJobId() { return jobId; }
        public void setJobId(UUID jobId) { this.jobId = jobId; }
        public Integer getMatchScore() { return matchScore; }
        public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}