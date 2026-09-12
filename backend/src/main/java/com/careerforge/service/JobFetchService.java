package com.careerforge.service;

import com.careerforge.model.entity.Job;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;   // ✅ THIS IS THE MISSING IMPORT

@Service
@RequiredArgsConstructor
@Slf4j
public class JobFetchService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    private static final String RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
    private static final String SEARCH_URL = "https://jsearch.p.rapidapi.com/search-v2";

    public List<Job> fetchJobsFromApi(String query, String location, String country) {
        try {
            String countryParam = (country != null && !country.isEmpty()) ? country : "in";
            String uri = SEARCH_URL + "?query=" + query + "+in+" + location + "&num_pages=1&country=" + countryParam;
            log.info("📡 Fetching jobs from JSearch API: {}", uri);

            String response = webClient.get()
                    .uri(uri)
                    .header("X-RapidAPI-Key", rapidApiKey)
                    .header("X-RapidAPI-Host", RAPIDAPI_HOST)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response == null || response.isEmpty()) {
                log.warn("Empty response from JSearch API");
                return new ArrayList<>();
            }

            return parseJobsFromResponse(response);

        } catch (Exception e) {
            log.error("Failed to fetch jobs from API: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<Job> parseJobsFromResponse(String json) throws Exception {
        JsonNode root = objectMapper.readTree(json);
        JsonNode jobsArray = root.path("data").path("jobs");
        List<Job> jobs = new ArrayList<>();

        if (!jobsArray.isArray()) {
            log.warn("No 'jobs' array found in API response");
            return jobs;
        }

        for (JsonNode item : jobsArray) {
            Job job = new Job();
            job.setId(UUID.randomUUID()); // ✅ Now works with import

            // Basic fields
            job.setTitle(item.path("job_title").asText("Untitled"));
            job.setCompany(item.path("employer_name").asText("Unknown Company"));
            job.setDescription(item.path("job_description").asText("No description provided."));
            job.setLocation("Remote");
            job.setJobType(item.path("job_employment_type").asText("Full-time"));
            job.setSalaryRange("Competitive");
            job.setMatchScore(0);

            // Apply link
            String applyLink = item.path("job_apply_link").asText("");
            if (applyLink != null && !applyLink.isEmpty()) {
                job.setApplyLink(applyLink);
            } else {
                String googleLink = item.path("job_google_link").asText("");
                job.setApplyLink(googleLink);
            }

            // Requirements
            String req = item.path("job_required_skills").asText("");
            if (req.isEmpty()) {
                String desc = job.getDescription();
                req = desc.length() > 200 ? desc.substring(0, 200) : desc;
            }
            job.setRequirements(req);

            // Location (city/state)
            String city = item.path("job_city").asText("");
            String state = item.path("job_state").asText("");
            if (!city.isEmpty() && !state.isEmpty()) {
                job.setLocation(city + ", " + state);
            } else if (!city.isEmpty()) {
                job.setLocation(city);
            }

            jobs.add(job);
        }

        log.info("✅ Parsed {} jobs from API response", jobs.size());
        return jobs;
    }
}