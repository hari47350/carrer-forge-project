package com.careerforge.service;

import com.careerforge.model.entity.Application;
import com.careerforge.model.entity.Application.ApplicationStatus;
import com.careerforge.model.entity.Job;
import com.careerforge.model.entity.User;
import com.careerforge.repository.ApplicationRepository;
import com.careerforge.repository.UserRepository;
import com.careerforge.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Transactional
    public Application createApplication(UUID userId, UUID jobId, Integer matchScore, String notes) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setMatchScore(matchScore);
        application.setAppliedDate(LocalDate.now());
        application.setNotes(notes);

        return applicationRepository.save(application);
    }

    @Transactional
    public Application updateApplicationStatus(UUID applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public List<Application> getUserApplications(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByUser(user);
    }

    public List<Application> getUserApplicationsByStatus(UUID userId, ApplicationStatus status) {
        return applicationRepository.findByUserIdAndStatus(userId, status);
    }

    public long getApplicationCountByStatus(UUID userId, ApplicationStatus status) {
        return applicationRepository.countByUserIdAndStatus(userId, status);
    }
}