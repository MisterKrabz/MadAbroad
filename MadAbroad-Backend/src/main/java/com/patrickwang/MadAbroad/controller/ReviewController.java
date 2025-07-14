package com.patrickwang.MadAbroad.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.patrickwang.MadAbroad.dto.ReviewDetailDto;
import com.patrickwang.MadAbroad.model.Review;
import com.patrickwang.MadAbroad.model.User;
import com.patrickwang.MadAbroad.service.ReviewService;

import lombok.RequiredArgsConstructor;

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
            @RequestParam("review") String reviewJson,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            throw new IllegalStateException("User must be authenticated to post a review.");
        }
        
        Review review;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            review = objectMapper.readValue(reviewJson, Review.class);
        } catch (IOException e) {
            throw new RuntimeException("Could not parse review JSON: " + e.getMessage());
        }

        return reviewService.createReviewForProgram(programId, review, currentUser, files);
    }

    @GetMapping
    public List<ReviewDetailDto> getReviewsForProgram(@PathVariable Long programId) {
        return reviewService.getReviewsByProgramId(programId);
    }
}