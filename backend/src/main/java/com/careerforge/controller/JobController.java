package com.careerforge.controller;

import com.careerforge.model.entity.Job;
import com.careerforge.repository.JobRepository;
import com.careerforge.service.JobMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class JobController {

    private final JobMatchingService jobMatchingService;
    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobMatchingService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable UUID id) {
        Job job = jobMatchingService.getJobById(id);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(job);
    }

    @PostMapping("/match")
    public ResponseEntity<List<Job>> matchJobs(@RequestBody MatchRequest request) {
        List<Job> matchedJobs = jobMatchingService.matchJobs(
            request.getResumeText(),
            request.getPreferredLocation(),
            request.getCountry()   // ✅ Now passing country
        );
        return ResponseEntity.ok(matchedJobs);
    }

    @PostMapping("/seed")
    public ResponseEntity<List<Job>> seedJobs() {
        List<Job> sampleJobs = List.of(
            createJob("Senior Java Developer", "TechCorp Inc.",
                "Build enterprise-grade applications",
                "Java,Spring,Microservices,AWS,Docker",
                "Remote", "$120k-$150k", "Full-time"),
            createJob("React Frontend Developer", "DesignStudio",
                "Build responsive web applications",
                "React,TypeScript,Tailwind,CSS,GraphQL",
                "New York, NY", "$100k-$130k", "Full-time"),
            createJob("DevOps Engineer", "CloudNative Inc.",
                "Manage cloud infrastructure and CI/CD pipelines",
                "AWS,Docker,Kubernetes,Terraform,Linux",
                "Remote", "$140k-$180k", "Full-time")
        );
        jobRepository.saveAll(sampleJobs);
        return ResponseEntity.ok(sampleJobs);
    }

    private Job createJob(String title, String company, String description,
                          String requirements, String location,
                          String salaryRange, String jobType) {
        Job job = new Job();
        job.setTitle(title);
        job.setCompany(company);
        job.setDescription(description);
        job.setRequirements(requirements);
        job.setLocation(location);
        job.setSalaryRange(salaryRange);
        job.setJobType(jobType);
        job.setMatchScore(0);
        return job;
    }

    // ✅ Updated DTO with 'country' field
    public static class MatchRequest {
        private String resumeText;
        private String preferredLocation;
        private String country;

        public String getResumeText() { return resumeText; }
        public void setResumeText(String resumeText) { this.resumeText = resumeText; }
        public String getPreferredLocation() { return preferredLocation; }
        public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }
}