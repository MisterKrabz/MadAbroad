package com.patrickwang.MadAbroad.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.patrickwang.MadAbroad.model.Review;
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

    public Review createReviewForProgram(Long programId, Review review, List<MultipartFile> files) {
        // Step 1: Find the parent program and associate it
        StudyAbroadProgram program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));
        review.setProgram(program);

        // Step 2: Perform the first save to get a generated ID for the review
        Review savedReview = reviewRepository.save(review);
        Long reviewId = savedReview.getId();

        // Step 3: Store the files and collect their paths
        List<String> imageUrls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            if (files.size() > 9) {
                throw new RuntimeException("Cannot upload more than 9 images.");
            }
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    String filePath = fileStorageService.storeFile(file, reviewId);
                    imageUrls.add(filePath);
                }
            }
        }
        
        // Step 4: Update the review with the image URLs and save it again
        savedReview.setImageUrls(imageUrls);
        return reviewRepository.save(savedReview);
    }

    public List<Review> getReviewsByProgramId(Long programId) {
        return reviewRepository.findByProgramId(programId);
    }
}