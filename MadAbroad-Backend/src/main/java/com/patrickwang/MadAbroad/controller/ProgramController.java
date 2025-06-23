package com.patrickwang.MadAbroad.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @PostMapping
    public StudyAbroadProgram createProgram(@RequestBody StudyAbroadProgram program) {
        // --- DIAGNOSTIC LOGGING ---
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        System.out.println("!!!!!!!!!! REQUEST RECEIVED BY CONTROLLER !!!!!!!!!!");
        if (program != null) {
            System.out.println("--> Received Program Name: " + program.getProgramName());
            System.out.println("--> Received Country: " + program.getCountry());
        } else {
            System.out.println("--> ERROR: The program object is NULL after JSON conversion.");
        }
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // --- END OF DIAGNOSTIC LOGGING ---

        return programService.createProgram(program);
    }


    @GetMapping // This annotation maps HTTP GET requests for /api/programs to this method.
    public List<StudyAbroadProgram> getAllPrograms() {
    return programService.getAllPrograms();
    }

    @GetMapping("/{id}") // This maps GET requests for /api/programs/1, /api/programs/2, etc.
    public ResponseEntity<StudyAbroadProgram> getProgramById(@PathVariable Long id) {
    // The @PathVariable annotation takes the "id" from the URL and passes it to the method.
    return programService.getProgramById(id)
        .map(program -> ResponseEntity.ok(program)) // If the program is found, return it with a 200 OK status.
        .orElse(ResponseEntity.notFound().build()); // If not found, return a 404 Not Found status.
    }
}