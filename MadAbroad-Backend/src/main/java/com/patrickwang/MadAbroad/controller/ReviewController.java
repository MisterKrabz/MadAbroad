package com.patrickwang.MadAbroad.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus; // Import the DTO
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.patrickwang.MadAbroad.model.Review;
import com.patrickwang.MadAbroad.model.ReviewDTO;
import com.patrickwang.MadAbroad.service.HCaptchaService;
import com.patrickwang.MadAbroad.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final HCaptchaService hcaptchaService;

    // This endpoint now correctly returns a List of ReviewDTOs
    @GetMapping("/trending")
    public List<ReviewDTO> getTrendingReviews() {
        return reviewService.getTrendingReviews();
    }

    // This endpoint remains the same
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review postReview(
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam("review") String reviewJson,
            @RequestParam("h-captcha-response") String captchaResponse
    ) {
        hcaptchaService.verify(captchaResponse);
        Review review;
        try {
            review = new ObjectMapper().readValue(reviewJson, Review.class);
        } catch (IOException e) {
            throw new RuntimeException("Could not parse review JSON: " + e.getMessage());
        }
        if (review.getProgram() == null || review.getProgram().getId() == null) {
            throw new RuntimeException("Program ID must be included in the review payload.");
        }
        return reviewService.createReviewForProgram(review.getProgram().getId(), review, files);
    }

    // This endpoint remains the same
    @GetMapping("/program/{programId}")
    public List<Review> getReviewsForProgram(@PathVariable Long programId) {
        return reviewService.getReviewsByProgramId(programId);
    }
}