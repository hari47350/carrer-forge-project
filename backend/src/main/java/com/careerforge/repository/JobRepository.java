package com.careerforge.repository;

import com.careerforge.model.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCase(String title, String company);
    
    @Query("SELECT j FROM Job j WHERE j.location LIKE %:location%")
    List<Job> findByLocationContaining(@Param("location") String location);
}