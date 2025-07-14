package com.patrickwang.MadAbroad.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.patrickwang.MadAbroad.dto.ReviewDetailDto;
import com.patrickwang.MadAbroad.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews") // A new top-level mapping for reviews
@RequiredArgsConstructor
public class TopLevelReviewController {

    private final ReviewService reviewService;

    @GetMapping("/trending")
    public List<ReviewDetailDto> getTrendingReviews() {
        return reviewService.getTrendingReviews();
    }
}