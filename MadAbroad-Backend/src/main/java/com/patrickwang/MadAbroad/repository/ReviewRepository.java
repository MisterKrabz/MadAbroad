package com.patrickwang.MadAbroad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.patrickwang.MadAbroad.model.Review;

/*
 * handles all communication with the database for Reviews
 */
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Spring Data JPA will automatically create the query to find all reviews
    // where the 'program' field's 'id' property matches the given programId.
    List<Review> findByProgramId(Long programId);

    // Finds all reviews associated with a specific user's ID.
    List<Review> findByUserId(Long userId);

    // Finds the top 50 most helpful reviews.
    List<Review> findTop50ByOrderByHelpfulDesc();
}