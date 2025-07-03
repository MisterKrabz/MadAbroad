package com.patrickwang.MadAbroad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram; // Make sure to import List

/*
 * Handles all communication with the database for StudyAbroadPrograms
 */
public interface ProgramRepository extends JpaRepository<StudyAbroadProgram, Long> {

    /**
     * Searches for programs where the search term matches text in the name, country, city, terms, or focus areas.
     * The search is case-insensitive.
     *
     * @param searchTerm The string to search for.
     * @return A list of matching study abroad programs.
     */
    @Query("SELECT p FROM StudyAbroadProgram p WHERE " +
           "LOWER(p.programUniversityName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.country) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.terms) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.areasOfFocus) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<StudyAbroadProgram> searchPrograms(@Param("searchTerm") String searchTerm);
}