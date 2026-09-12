package com.careerforge.service;

import com.careerforge.model.entity.Job;
import com.careerforge.model.entity.SavedJob;
import com.careerforge.model.entity.User;
import com.careerforge.repository.SavedJobRepository;
import com.careerforge.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;

    @Transactional
    public SavedJob saveJob(User user, UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if already saved
        if (savedJobRepository.findByUserAndJob(user, job).isPresent()) {
            throw new RuntimeException("Job already saved");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setUser(user);
        savedJob.setJob(job);
        return savedJobRepository.save(savedJob);
    }

    @Transactional
    public void unsaveJob(User user, UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        savedJobRepository.deleteByUserAndJob(user, job);
    }

    public List<SavedJob> getSavedJobs(User user) {
        return savedJobRepository.findByUser(user);
    }

    public boolean isJobSaved(User user, UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return savedJobRepository.findByUserAndJob(user, job).isPresent();
    }
}