package com.patrickwang.MadAbroad.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram;

public interface ProgramRepository extends JpaRepository<StudyAbroadProgram, Long> {
}

