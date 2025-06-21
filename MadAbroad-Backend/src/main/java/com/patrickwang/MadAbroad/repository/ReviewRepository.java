
package com.patrickwang.MadAbroad.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.patrickwang.MadAbroad.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
