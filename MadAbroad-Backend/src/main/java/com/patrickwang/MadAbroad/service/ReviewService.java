package com.patrickwang.MadAbroad.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects; 
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.patrickwang.MadAbroad.model.ProgramDTO;
import com.patrickwang.MadAbroad.model.Review;
import com.patrickwang.MadAbroad.model.ReviewDTO;
import com.patrickwang.MadAbroad.model.StudyAbroadProgram;
import com.patrickwang.MadAbroad.repository.ProgramRepository;
import com.patrickwang.MadAbroad.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProgramRepository programRepository;
    private final FileStorageService fileStorageService;

    // This method remains the same
    public Review createReviewForProgram(Long programId, Review review, List<MultipartFile> photos) {
        // ... (no changes in this method)
        StudyAbroadProgram program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));
        review.setProgram(program);
        Review savedReview = reviewRepository.save(review);
        Long reviewId = savedReview.getId();
        List<String> imageUrls = new ArrayList<>();
        if (photos != null && !photos.isEmpty()) {
            if (photos.size() > 9) {
                throw new RuntimeException("Cannot upload more than 9 images.");
            }
            for (MultipartFile file : photos) {
                if (file != null && !file.isEmpty()) {
                    String filePath = fileStorageService.storeFile(file, reviewId);
                    imageUrls.add(filePath);
                }
            }
        }
        savedReview.setImageUrls(imageUrls);
        return reviewRepository.save(savedReview);
    }

    // This method remains the same
    public List<Review> getReviewsByProgramId(Long programId) {
        return reviewRepository.findByProgramId(programId);
    }

    // UPDATED METHOD for diagnostic testing
    public List<ReviewDTO> getTrendingReviews() {
        System.out.println("--- Starting getTrendingReviews (DIAGNOSTIC MODE) ---");

        // Call the simplest possible query to fetch all reviews
        List<Review> allReviews = reviewRepository.findAllWithPrograms();
        
        System.out.println("Step 1: Found " + allReviews.size() + " total reviews from the repository.");

        // We will shuffle and take from this full list for the test
        Collections.shuffle(allReviews);
        List<Review> random10 = allReviews.subList(0, Math.min(10, allReviews.size()));

        System.out.println("Step 2: Selected " + random10.size() + " random reviews to display.");

        // Here's the important change: filter out any reviews that have a null program
        // before we try to convert them. This prevents any NullPointerExceptions.
        List<ReviewDTO> dtoList = random10.stream()
                .filter(review -> Objects.nonNull(review.getProgram()))
                .map(this::convertToDto)
                .collect(Collectors.toList());

        System.out.println("Step 3: Finished converting to DTOs. Final list size: " + dtoList.size());
        System.out.println("--- Finished getTrendingReviews ---");

        return dtoList;
    }

    // This helper method remains the same
    private ReviewDTO convertToDto(Review review) {
        // ... (no changes in this method)
        ProgramDTO programDto = new ProgramDTO(
            review.getProgram().getId(),
            review.getProgram().getProgramUniversityName()
        );
        return new ReviewDTO(
            review.getId(),
            review.getRating(),
            review.getTitle(),
            review.getPersonalAnecdote(),
            review.getHelpful(),
            review.getReviewDate(),
            programDto
        );
    }
}