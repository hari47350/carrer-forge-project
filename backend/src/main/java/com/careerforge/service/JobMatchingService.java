package com.careerforge.service;

import com.careerforge.model.entity.Job;
import com.careerforge.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobMatchingService {

    private final JobRepository jobRepository;
    private final JobFetchService jobFetchService;

    // ✅ Updated to accept country parameter
    public List<Job> matchJobs(String resumeText, String preferredLocation, String country) {
        // 1. Fetch external jobs from API
        System.out.println("📡 Calling JobFetchService for location: " + preferredLocation + ", country: " + country);
        List<Job> externalJobs = jobFetchService.fetchJobsFromApi("developer", preferredLocation, country);
        System.out.println("📡 Fetched " + externalJobs.size() + " external jobs");

        // 2. Get local seeded jobs
        List<Job> localJobs = jobRepository.findAll();
        System.out.println("📦 Fetched " + localJobs.size() + " local jobs");

        // 3. Combine (deduplicate by title + company)
        Map<String, Job> jobMap = new LinkedHashMap<>();
        for (Job job : localJobs) {
            String key = job.getTitle() + "|" + job.getCompany();
            jobMap.putIfAbsent(key, job);
        }
        for (Job job : externalJobs) {
            String key = job.getTitle() + "|" + job.getCompany();
            jobMap.putIfAbsent(key, job);
        }
        List<Job> allJobs = new ArrayList<>(jobMap.values());

        // 4. Score each job
        Set<String> resumeSkills = extractSkills(resumeText);
        for (Job job : allJobs) {
            int score = calculateMatchScore(job, resumeSkills);
            job.setMatchScore(score);
        }

        // 5. Sort by match score (descending)
        allJobs.sort((j1, j2) -> j2.getMatchScore().compareTo(j1.getMatchScore()));
        return allJobs;
    }

    private int calculateMatchScore(Job job, Set<String> resumeSkills) {
        if (job.getRequirements() == null || job.getRequirements().isEmpty()) {
            return 50;
        }
        Set<String> jobSkills = Arrays.stream(job.getRequirements().split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        if (jobSkills.isEmpty()) return 50;

        long matched = jobSkills.stream()
                .filter(skill -> resumeSkills.stream()
                        .anyMatch(resSkill -> resSkill.toLowerCase().contains(skill) ||
                                skill.contains(resSkill.toLowerCase())))
                .count();

        return (int) Math.min(100, (double) matched / jobSkills.size() * 100);
    }

    private Set<String> extractSkills(String text) {
        String[] commonSkills = {
            "Java", "Spring", "React", "Angular", "Vue", "Python", "Django",
            "Flask", "JavaScript", "TypeScript", "Node.js", "Express", "MongoDB",
            "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS",
            "Azure", "GCP", "Git", "CI/CD", "REST", "GraphQL", "Microservices"
        };
        Set<String> found = new HashSet<>();
        for (String skill : commonSkills) {
            if (text.toLowerCase().contains(skill.toLowerCase())) {
                found.add(skill);
            }
        }
        return found;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(UUID id) {
        return jobRepository.findById(id).orElse(null);
    }
}