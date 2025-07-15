package com.patrickwang.MadAbroad.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.patrickwang.MadAbroad.dto.ReviewDetailDto;
import com.patrickwang.MadAbroad.dto.ReviewRequestDto;
import com.patrickwang.MadAbroad.model.Review;
import com.patrickwang.MadAbroad.model.StudyAbroadProgram;
import com.patrickwang.MadAbroad.model.User;
import com.patrickwang.MadAbroad.repository.ProgramRepository;
import com.patrickwang.MadAbroad.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProgramRepository programRepository;
    private final FileStorageService fileStorageService;
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Transactional
    public Review createReviewForProgram(Long programId, ReviewRequestDto reviewDto, User currentUser, List<MultipartFile> photos) {
        logger.info("--- ENTERING createReviewForProgram SERVICE METHOD ---");
        
        logger.info("Finding program with ID: {}", programId);
        StudyAbroadProgram program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));
        logger.info("Found program: {}", program.getProgramUniversityName());

        logger.info("Creating new Review entity...");
        Review review = new Review();
        review.setUser(currentUser);
        review.setProgram(program);
        review.setTitle(reviewDto.getTitle());
        review.setPersonalAnecdote(reviewDto.getPersonalAnecdote());
        review.setRating(reviewDto.getRating());
        review.setSocialScene(reviewDto.getSocialScene());
        review.setAcademicDifficulty(reviewDto.getAcademicDifficulty());
        review.setCreditTransferability(reviewDto.getCreditTransferability());
        review.setCulture(reviewDto.getCulture());
        logger.info("Review entity created, preparing to save.");

        Review savedReview = reviewRepository.save(review);
        Long reviewId = savedReview.getId();
        logger.info("SUCCESS: Initial review saved with ID: {}", reviewId);

        if (photos != null && !photos.isEmpty()) {
            logger.info("Processing {} photos...", photos.size());
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : photos) {
                if (file != null && !file.isEmpty()) {
                    String filePath = fileStorageService.storeFile(file, reviewId);
                    imageUrls.add(filePath);
                    logger.info("Stored file: {}", filePath);
                }
            }
            savedReview.setImageUrls(imageUrls);
            reviewRepository.save(savedReview); // Persist image URLs
            logger.info("All photo URLs set and saved on review object.");
        } else {
            logger.info("No photos to process.");
        }
        
        logger.info("Calling updateProgramAverages for program ID: {}", programId);
        updateProgramAverages(programId);
        logger.info("SUCCESS: updateProgramAverages completed.");

        return savedReview;
    }

    @Transactional
    public void updateProgramAverages(Long programId) {
        logger.info("--- ENTERING updateProgramAverages ---");
        StudyAbroadProgram program = programRepository.findById(programId)
            .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));

        program.setAvgRating(reviewRepository.getAverageRating(programId));
        program.setAvgSocialScene(reviewRepository.getAverageSocialScene(programId));
        program.setAvgAcademicDifficulty(reviewRepository.getAverageAcademicDifficulty(programId));
        program.setAvgCreditTransferability(reviewRepository.getAverageCreditTransferability(programId));
        program.setAvgCulture(reviewRepository.getAverageCulture(programId));
        program.setReviewCount(reviewRepository.findByProgramId(programId).size());

        programRepository.save(program);
        logger.info("SUCCESS: Program averages updated and saved for program ID: {}", programId);
    }

    public List<ReviewDetailDto> getReviewsByProgramId(Long programId) {
        return reviewRepository.findByProgramId(programId).stream()
                .map(ReviewDetailDto::new)
                .collect(Collectors.toList());
    }

    public List<ReviewDetailDto> getTrendingReviews() {
        List<Review> top50Helpful = reviewRepository.findTop50ByOrderByHelpfulDesc();
        Collections.shuffle(top50Helpful);
        List<Review> random10 = top50Helpful.stream().limit(10).collect(Collectors.toList());

        return random10.stream()
                .map(ReviewDetailDto::new)
                .collect(Collectors.toList());
    }
    
    public List<ReviewDetailDto> getReviewsForUser(User user) {
        return reviewRepository.findByUserId(user.getId()).stream()
                .map(ReviewDetailDto::new)
                .collect(Collectors.toList());
    }
}