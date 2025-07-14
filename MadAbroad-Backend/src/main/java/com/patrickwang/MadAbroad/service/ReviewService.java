package com.patrickwang.MadAbroad.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.patrickwang.MadAbroad.dto.ReviewDetailDto;
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

    // This method still returns the full Review entity because the creation logic needs it.
    public Review createReviewForProgram(Long programId, Review review, User currentUser, List<MultipartFile> photos) {
        StudyAbroadProgram program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + programId));
        review.setProgram(program);
        review.setUser(currentUser);

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

    public List<ReviewDetailDto> getReviewsByProgramId(Long programId) {
        return reviewRepository.findByProgramId(programId).stream()
                .map(ReviewDetailDto::new) // Convert each Review to a ReviewDetailDto
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
                .map(ReviewDetailDto::new) // Convert each Review to a ReviewDetailDto
                .collect(Collectors.toList());
    }


}