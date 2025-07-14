package com.patrickwang.MadAbroad.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.patrickwang.MadAbroad.model.Review;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReviewDetailDto {
    private Long id;
    private int rating;
    private int socialScene;
    private int academicDifficulty;
    private int creditTransferability;
    private int culture;
    private String title;
    private String personalAnecdote;
    private LocalDateTime reviewDate;
    private int helpful;
    private List<String> imageUrls;
    private UserSummaryDto user;
    private ProgramSummaryDto program;

    // This is a "mapping" constructor that converts an Entity to a DTO
    public ReviewDetailDto(Review review) {
        this.id = review.getId();
        this.rating = review.getRating();
        this.socialScene = review.getSocialScene();
        this.academicDifficulty = review.getAcademicDifficulty();
        this.creditTransferability = review.getCreditTransferability();
        this.culture = review.getCulture();
        this.title = review.getTitle();
        this.personalAnecdote = review.getPersonalAnecdote();
        this.reviewDate = review.getReviewDate();
        this.helpful = review.getHelpful();
        this.imageUrls = review.getImageUrls();
        this.user = new UserSummaryDto(review.getUser().getId(), review.getUser().getName());
        this.program = new ProgramSummaryDto(review.getProgram().getId(), review.getProgram().getProgramUniversityName());
    }
}