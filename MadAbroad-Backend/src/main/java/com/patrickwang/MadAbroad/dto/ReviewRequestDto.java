package com.patrickwang.MadAbroad.dto;

import lombok.Data;

// This DTO represents the data coming from the frontend "Post a Review" form.
@Data
public class ReviewRequestDto {
    private String title;
    private String personalAnecdote;
    private int rating;
    private int socialScene;
    private int academicDifficulty;
    private int creditTransferability;
    private int culture;
}