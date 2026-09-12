package com.careerforge.controller;

import com.careerforge.model.entity.SavedJob;
import com.careerforge.model.entity.User;
import com.careerforge.repository.UserRepository;
import com.careerforge.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/saved-jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class SavedJobController {

    private final SavedJobService savedJobService;
    private final UserRepository userRepository;   // ✅ Inject UserRepository

    @PostMapping
    public ResponseEntity<SavedJob> saveJob(Authentication authentication, @RequestBody Map<String, UUID> payload) {
        User user = getAuthenticatedUser(authentication);
        UUID jobId = payload.get("jobId");
        return ResponseEntity.ok(savedJobService.saveJob(user, jobId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> unsaveJob(Authentication authentication, @PathVariable UUID jobId) {
        User user = getAuthenticatedUser(authentication);
        savedJobService.unsaveJob(user, jobId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SavedJob>> getSavedJobs(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(savedJobService.getSavedJobs(user));
    }

    @GetMapping("/{jobId}/saved")
    public ResponseEntity<Map<String, Boolean>> isJobSaved(Authentication authentication, @PathVariable UUID jobId) {
        User user = getAuthenticatedUser(authentication);
        boolean saved = savedJobService.isJobSaved(user, jobId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    // ✅ Helper to get the authenticated user
    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}