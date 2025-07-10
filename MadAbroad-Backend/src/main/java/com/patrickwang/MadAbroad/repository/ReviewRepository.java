// In com.patrickwang.MadAbroad.repository.ReviewRepository.java

package com.patrickwang.MadAbroad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.patrickwang.MadAbroad.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProgramId(Long programId);

    // a LEFT JOIN used to ensure we get all reviews,
    // even if their associated program has been deleted or is missing.
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.program")
    List<Review> findAllWithPrograms();
}