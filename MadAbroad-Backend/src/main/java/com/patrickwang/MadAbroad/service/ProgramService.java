package com.patrickwang.MadAbroad.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram;
import com.patrickwang.MadAbroad.repository.ProgramRepository;

import jakarta.persistence.criteria.Predicate;

/*
 * This class handles the business logic of the application. It handles rules, calculations, and operations of the application. 
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

    // This method handles the simple text search from the hero search bar
    public List<StudyAbroadProgram> searchPrograms(String searchTerm) {
        return programRepository.searchPrograms(searchTerm);
    }

    /**
     * Filters programs based on multiple optional criteria using JPA Specifications.
     * @param focus The area of focus to filter by.
     * @param term The term (e.g., Fall, Spring) to filter by.
     * @param language The language of the program.
     * @param location A search term for either the country or the city.
     * @return A list of matching study abroad programs.
     */
    public List<StudyAbroadProgram> filterPrograms(String focus, String term, String language, String location) {
        // The Specification builds the WHERE clause of the query dynamically.
        Specification<StudyAbroadProgram> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(focus) && !"any focus area".equalsIgnoreCase(focus)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("areasOfFocus")), "%" + focus.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(term) && !"any term".equalsIgnoreCase(term)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("terms")), "%" + term.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(language) && !"any language".equalsIgnoreCase(language)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("language")), "%" + language.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(location)) {
                // This creates a predicate for: (LOWER(country) LIKE '%location%' OR LOWER(city) LIKE '%location%')
                Predicate countryMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("country")), "%" + location.toLowerCase() + "%");
                Predicate cityMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("city")), "%" + location.toLowerCase() + "%");
                predicates.add(criteriaBuilder.or(countryMatch, cityMatch));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return programRepository.findAll(spec);
    }

    public StudyAbroadProgram saveProgram(StudyAbroadProgram program) {
        return programRepository.save(program);
    }
}