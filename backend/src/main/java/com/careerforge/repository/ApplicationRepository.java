package com.careerforge.repository;

import com.careerforge.model.entity.Application;
import com.careerforge.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByUser(User user);
    
    @Query("SELECT a FROM Application a WHERE a.user.id = :userId AND a.status = :status")
    List<Application> findByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") Application.ApplicationStatus status);
    
    @Query("SELECT COUNT(a) FROM Application a WHERE a.user.id = :userId AND a.status = :status")
    long countByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") Application.ApplicationStatus status);
}