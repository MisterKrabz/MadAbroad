package com.patrickwang.MadAbroad.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.patrickwang.MadAbroad.dto.ReviewDetailDto;
import com.patrickwang.MadAbroad.model.User;
import com.patrickwang.MadAbroad.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final ReviewService reviewService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/reviews")
    public ResponseEntity<List<ReviewDetailDto>> getMyReviews(@AuthenticationPrincipal User user) { // <-- FIX IS HERE
        List<ReviewDetailDto> reviews = reviewService.getReviewsForUser(user);
        return ResponseEntity.ok(reviews);
    }
}