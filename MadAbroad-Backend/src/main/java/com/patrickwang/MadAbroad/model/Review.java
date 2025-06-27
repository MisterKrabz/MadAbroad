/*
 * this class is a blueprint model for defining what a "Review" is to the database 
 */

 package com.patrickwang.MadAbroad.model;

 import java.time.LocalDateTime;
 import java.util.ArrayList;
 import java.util.List;
 
 import jakarta.persistence.CollectionTable;
 import jakarta.persistence.Column;
 import jakarta.persistence.ElementCollection;
 import jakarta.persistence.Entity;
 import jakarta.persistence.FetchType;
 import jakarta.persistence.GeneratedValue;
 import jakarta.persistence.GenerationType;
 import jakarta.persistence.Id;
 import jakarta.persistence.JoinColumn;
 import jakarta.persistence.Lob;
 import jakarta.persistence.ManyToOne;
 import jakarta.persistence.PrePersist;
 import jakarta.persistence.Table;
 
 @Entity
 @Table(name = "reviews")
 public class Review {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;
 
     @Column(nullable = false)
     private int rating; 
 
     @Lob
     @Column(columnDefinition = "TEXT", nullable = false)
     private String title;
     private String comment;
     private int helpful;
     private LocalDateTime reviewDate;
 
     // This now stores a list of image paths for the review.
     @ElementCollection(fetch = FetchType.EAGER) // EAGER fetch ensures image URLs are always loaded with the review.
     @CollectionTable(name = "review_image_urls", joinColumns = @JoinColumn(name = "review_id")) // Creates a separate table for the URLs.
     @Column(name = "image_url") // Defines the column name in the new table.
     private List<String> imageUrls = new ArrayList<>();
 
 
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
     public String getTitle(){ return title; }
     public void setTitle(String title) { this.title = title; } 
     public String getComment() { return comment; }
     public void setComment(String comment) { this.comment = comment; }
     public LocalDateTime getReviewDate() { return reviewDate; }
     public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
     public StudyAbroadProgram getProgram() { return program; }
     public void setProgram(StudyAbroadProgram program) { this.program = program; }
     public int getHelpful(){ return helpful; }
     public void setHelpful(int helpful){ this.helpful = helpful; }
 
     // Getters and Setters for the new image URLs list
     public List<String> getImageUrls() { return imageUrls; }
     public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
 }
 