package com.careerforge.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private String location;
    private String salaryRange;
    private String jobType; // Full-time, Part-time, Contract, Remote

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "apply_link", length = 1000)   // ✅ NEW FIELD
    private String applyLink;                     // ✅ URL to external job application

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}