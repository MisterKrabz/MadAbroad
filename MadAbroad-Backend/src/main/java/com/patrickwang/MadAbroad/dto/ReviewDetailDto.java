package com.patrickwang.MadAbroad.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.patrickwang.MadAbroad.model.Review;
import com.patrickwang.MadAbroad.model.StudyAbroadProgram;
import com.patrickwang.MadAbroad.model.User;

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

    // This constructor is now more robust and handles nulls gracefully.
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
        
        // Safely handle the user object
        User reviewUser = review.getUser();
        if (reviewUser != null) {
            this.user = new UserSummaryDto(reviewUser.getId(), reviewUser.getName());
        }

        // Safely handle the program object
        StudyAbroadProgram reviewProgram = review.getProgram();
        if (reviewProgram != null) {
            this.program = new ProgramSummaryDto(reviewProgram.getId(), reviewProgram.getProgramUniversityName());
        }
    }
}