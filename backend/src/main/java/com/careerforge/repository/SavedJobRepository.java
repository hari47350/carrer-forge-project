package com.careerforge.repository;

import com.careerforge.model.entity.SavedJob;
import com.careerforge.model.entity.User;
import com.careerforge.model.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SavedJobRepository extends JpaRepository<SavedJob, UUID> {
    List<SavedJob> findByUser(User user);
    Optional<SavedJob> findByUserAndJob(User user, Job job);
    void deleteByUserAndJob(User user, Job job);
}