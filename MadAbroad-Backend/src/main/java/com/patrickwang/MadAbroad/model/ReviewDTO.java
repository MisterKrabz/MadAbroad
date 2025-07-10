package com.patrickwang.MadAbroad.model;

import java.time.LocalDateTime;

// This DTO defines the exact shape of the review data we send to the frontend.
public record ReviewDTO(
    Long id,
    int rating,
    String title,
    String personalAnecdote,
    int helpful,
    LocalDateTime reviewDate,
    ProgramDTO program // It includes the simplified ProgramDTO
) {
    // The record automatically generates a constructor, getters, equals(), hashCode(), and toString().
}