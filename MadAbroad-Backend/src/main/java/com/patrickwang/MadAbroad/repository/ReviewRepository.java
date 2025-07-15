package com.patrickwang.MadAbroad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.patrickwang.MadAbroad.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProgramId(Long programId);
    List<Review> findByUserId(Long userId);
    List<Review> findTop50ByOrderByHelpfulDesc();

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.program.id = :programId")
    Double getAverageRating(@Param("programId") Long programId);

    @Query("SELECT COALESCE(AVG(r.socialScene), 0.0) FROM Review r WHERE r.program.id = :programId")
    Double getAverageSocialScene(@Param("programId") Long programId);

    @Query("SELECT COALESCE(AVG(r.academicDifficulty), 0.0) FROM Review r WHERE r.program.id = :programId")
    Double getAverageAcademicDifficulty(@Param("programId") Long programId);

    @Query("SELECT COALESCE(AVG(r.creditTransferability), 0.0) FROM Review r WHERE r.program.id = :programId")
    Double getAverageCreditTransferability(@Param("programId") Long programId);

    @Query("SELECT COALESCE(AVG(r.culture), 0.0) FROM Review r WHERE r.program.id = :programId")
    Double getAverageCulture(@Param("programId") Long programId);
}