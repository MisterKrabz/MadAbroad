package com.patrickwang.MadAbroad.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram;
import com.patrickwang.MadAbroad.repository.ProgramRepository;

/*
 * This class handles the business logic of the application. It handles rules, calculations, and operations of the application. 
 * * examples of business logic: 
 * 1. creating programs 
 * 2. data validation 
 * 3. data transformation/enrichment 
 */
@Service // This annotation tells Spring that this is a service bean.
public class ProgramService {

    private final ProgramRepository programRepository;

    @Autowired // This tells Spring to inject the ProgramRepository bean. A Spring Bean is any java object created and managed by Spring framework. 
    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    /*
     * A "business logic" method 
     */
    public List<StudyAbroadProgram> getAllPrograms() {
        return programRepository.findAll();
    }
    
    public Optional<StudyAbroadProgram> getProgramById(Long id) {
        return programRepository.findById(id);
    }

    public List<StudyAbroadProgram> searchPrograms(String searchTerm) {
        // If the search term is blank or null, we should return all programs.
        if (searchTerm == null || searchTerm.isBlank()) {
            return programRepository.findAll();
        }
        // Otherwise, proceed with the specific query.
        return programRepository.searchPrograms(searchTerm);
    }

    public StudyAbroadProgram saveProgram(StudyAbroadProgram program) {
        return programRepository.save(program);
    }
}