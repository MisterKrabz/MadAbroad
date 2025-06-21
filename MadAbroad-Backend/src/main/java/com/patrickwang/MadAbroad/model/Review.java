package com.patrickwang.MadAbroad.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rating; // e.g., 1-5

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;
    
    private LocalDateTime reviewDate;

    // This is the relationship magic.
    @ManyToOne(fetch = FetchType.LAZY) // Signifies that MANY Reviews can belong to ONE Program. LAZY fetch is a performance optimization.
    @JoinColumn(name = "program_id", nullable = false) // This creates a 'program_id' column in the 'reviews' table to link back to the program.
    private StudyAbroadProgram program;

    @PrePersist // This JPA annotation tells the system to run this method before saving a new review.
    protected void onCreate() {
        reviewDate = LocalDateTime.now();
    }

    // Constructors, Getters, and Setters...
    public Review() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
    public StudyAbroadProgram getProgram() { return program; }
    public void setProgram(StudyAbroadProgram program) { this.program = program; }
}

