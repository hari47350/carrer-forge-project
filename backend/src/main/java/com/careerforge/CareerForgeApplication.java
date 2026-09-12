package com.careerforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CareerForgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerForgeApplication.class, args);
        System.out.println("🔥 CareerForge Backend Started!");
    }
}