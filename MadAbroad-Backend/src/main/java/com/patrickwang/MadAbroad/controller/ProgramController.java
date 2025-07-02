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

/*
 * This layer is the API's entry/exit point for all web requests related to study abroad programs. 
 * Its job is to receive incoming HTTP requests, delegate the business logic to the ProgramService,
 * and then format and return an HTTP response (usually as JSON).
 *
 * @RestConroller means that all values from methods in this class should be serialized into
 * JSON objects and written directly to the HTTP response body. 
 * 
 * @RequestMapping maps all requests for that URL path to this controller. 
 */
@RestController // Marks this class as a REST controller, which combines @Controller and @ResponseBody. 
                // @ ResponseBody auto converts the returned java objects into JSON for the HTTP response
@RequestMapping("/api/programs") // Maps all methods in this class to a base URL path. All endpoints will start with /api/programs
public class ProgramController {

    private final ProgramService programService;

    @Autowired
    public ProgramController(ProgramService programService) {
        this.programService = programService;
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
        .orElse(ResponseEntity.notFound().build()); // If the program aint found, return a 404 Not Found status.
    }

    @GetMapping("/search")
    public List<StudyAbroadProgram> searchPrograms(@RequestParam("q") String query) {
        return programService.searchPrograms(query);
    }

    /**
     * This method creates a new program. Used by the web scraper for initial data population and by admin for 
     * manual data entry in the event of a new program being added 
     * 
     * @param program
     * @return
     */
    @PostMapping // This annotation maps HTTP POST requests for /api/programs to this method.
    @ResponseStatus(HttpStatus.CREATED) // Sets the HTTP response status to 201 Created on success.
    public StudyAbroadProgram createProgram(@RequestBody StudyAbroadProgram program) {
        // The @RequestBody annotation tells Spring to convert the JSON from the request body
        // into a StudyAbroadProgram object.
        return programService.saveProgram(program); // You'll need to add a 'saveProgram' method to your service.
    }
}