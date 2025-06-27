package com.patrickwang.MadAbroad.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram;

/*
 * Handles all communication with the database for StudyAbroadPrograms
 */
public interface ProgramRepository extends JpaRepository<StudyAbroadProgram, Long> {
}

