package com.patrickwang.MadAbroad.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram;
import com.patrickwang.MadAbroad.repository.ProgramRepository;

@Service // This annotation tells Spring that this is a service bean.
public class ProgramService {

    private final ProgramRepository programRepository;

    @Autowired // This tells Spring to inject the ProgramRepository bean.
    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    // This is our first business logic method.
    public StudyAbroadProgram createProgram(StudyAbroadProgram program) {
        // The logic is simple: just save the program to the database.
        return programRepository.save(program);
    }

    public List<StudyAbroadProgram> getAllPrograms() {
        return programRepository.findAll();
    }
    
    public Optional<StudyAbroadProgram> getProgramById(Long id) {
        return programRepository.findById(id);
    }
}