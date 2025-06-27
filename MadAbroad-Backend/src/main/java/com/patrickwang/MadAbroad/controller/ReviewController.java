package com.patrickwang.MadAbroad.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.patrickwang.MadAbroad.model.Review;
import com.patrickwang.MadAbroad.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/programs/{programId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review postReview(
            @PathVariable Long programId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam("review") String reviewJson
    ) {
        Review review;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            review = objectMapper.readValue(reviewJson, Review.class);
        } catch (IOException e) {
            throw new RuntimeException("Could not parse review JSON: " + e.getMessage());
        }

        return reviewService.createReviewForProgram(programId, review, files);
    }

    @GetMapping
    public List<Review> getReviewsForProgram(@PathVariable Long programId) {
        return reviewService.getReviewsByProgramId(programId);
    }
}