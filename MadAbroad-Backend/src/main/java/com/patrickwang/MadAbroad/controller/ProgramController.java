package com.patrickwang.MadAbroad.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.patrickwang.MadAbroad.model.StudyAbroadProgram;
import com.patrickwang.MadAbroad.service.ProgramService;

@RestController
@RequestMapping("/api/programs")
public class ProgramController {

    private final ProgramService programService;

    @Autowired
    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }


    @GetMapping
    public List<StudyAbroadProgram> getAllPrograms() {
        return programService.getAllPrograms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyAbroadProgram> getProgramById(@PathVariable Long id) {
        return programService.getProgramById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * This endpoint now handles both simple text search and advanced filtering.
     * If 'q' is provided, it performs a simple text search.
     * If other params are provided, it performs a structured filter.
     */
    @GetMapping("/search")
    public List<StudyAbroadProgram> searchOrFilterPrograms(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(required = false) String focus,
            @RequestParam(required = false) String term,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String location
    ) {
        if (query != null && !query.isEmpty()) {
            return programService.searchPrograms(query); // For the hero search bar
        } else {
            return programService.filterPrograms(focus, term, language, location); // For the explore section
        }
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudyAbroadProgram createProgram(@RequestBody StudyAbroadProgram program) {
        return programService.saveProgram(program);
    }
}