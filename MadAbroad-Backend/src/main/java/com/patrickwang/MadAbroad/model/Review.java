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

/*
* this class is a blueprint model for defining what a "Review" is to the database 
*/
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // star reviews 
    @Column(nullable = false)
    private int rating; 
    private int social;
    private int academicDifficulty;
    private int culture;

    // text, @Lob used to change strings from VARCHAR(225) to TEXT types increasing character limits 
    @Lob 
    @Column(columnDefinition = "TEXT", nullable = false)
    private String title;
    @Lob 
    private String personalAnecdote;

    // extra stuff 
    private int helpful;
    private LocalDateTime reviewDate;


    // This stores a list of image paths for the review.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "review_image_urls", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    // THIS IS THE ONLY CHANGE: Changed FetchType to EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "program_id", nullable = false)
    private StudyAbroadProgram program;

    @PrePersist // This JPA annotation tells the system to run this method before saving a new review.
    protected void onCreate() {
    reviewDate = LocalDateTime.now();
    }

    public Review() {
    }

    // Constructors, Getters, and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getTitle(){ return title; }
    public void setTitle(String title) { this.title = title; } 
    public String getPersonalAnecdote() { return personalAnecdote; }
    public void setPersonalAnecdote(String personalAnecdote) { this.personalAnecdote = personalAnecdote; }
    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
    public StudyAbroadProgram getProgram() { return program; }
    public void setProgram(StudyAbroadProgram program) { this.program = program; }
    public int getHelpful(){ return helpful; }
    public void setHelpful(int helpful){ this.helpful = helpful; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public int getSocial(){ return social; }
    public void setSocial(int social){ this.social = social; }
    public int getAcademicDifficulty(){ return academicDifficulty; }
    public void setAcademicDifficulty(int academicDifficulty){ this.academicDifficulty = academicDifficulty; }
    public int getCulture(){ return culture; }
    public void setCulture(int culture){ this.culture = culture; }
}