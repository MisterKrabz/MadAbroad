package com.patrickwang.MadAbroad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // <-- IMPORT THIS
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram;

/*
 * Handles all communication with the database for StudyAbroadPrograms
 */
public interface ProgramRepository extends JpaRepository<StudyAbroadProgram, Long>, JpaSpecificationExecutor<StudyAbroadProgram> {

    /**
     * This query is now only used for the simple top-level search bar.
     * The advanced filtering will use Specifications.
     */
    @Query("SELECT p FROM StudyAbroadProgram p WHERE " +
           "LOWER(p.programUniversityName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.country) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.terms) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.areasOfFocus) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<StudyAbroadProgram> searchPrograms(@Param("searchTerm") String searchTerm);
}