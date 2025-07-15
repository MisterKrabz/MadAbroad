package com.patrickwang.MadAbroad.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column; 
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "programs")
public class StudyAbroadProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String programUniversityName;
    @Column(nullable = false) 
    private String country;
    @Column(nullable = false) 
    private String city;
    @Column(nullable = false) 
    private String terms;
    @Column(nullable = false) 
    private String areasOfFocus;
    @Column(nullable = false) 
    private String language;
    @Column(nullable = false) 
    private String link;

    // CORRECTED: Changed primitive double to wrapper Double to allow for null values
    @Column(name = "avg_rating")
    private Double avgRating;
    
    @Column(name = "avg_social_scene")
    private Double avgSocialScene;

    @Column(name = "avg_academic_difficulty")
    private Double avgAcademicDifficulty;

    @Column(name = "avg_credit_transferability")
    private Double avgCreditTransferability;

    @Column(name = "avg_culture")
    private Double avgCulture;
    
    @Column(name = "review_count")
    private int reviewCount = 0;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Review> reviews;

    // --- CONSTRUCTORS ---
    public StudyAbroadProgram() {}

    // --- GETTERS AND SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProgramUniversityName() { return programUniversityName; }
    public void setProgramUniversityName(String programUniversityName) { this.programUniversityName = programUniversityName; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getTerms(){ return terms; }
    public void setTerms(String terms) { this.terms = terms; }
    public String getAreasOfFocus(){ return areasOfFocus; }
    public void setAreasOfFocus( String areasOfFocus ){ this.areasOfFocus = areasOfFocus; }
    public String getLanguage(){ return language; }
    public void setLanguage( String language ){ this.language = language; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    // Getters and Setters for new/updated fields
    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    public Double getAvgSocialScene() { return avgSocialScene; }
    public void setAvgSocialScene(Double avgSocialScene) { this.avgSocialScene = avgSocialScene; }
    public Double getAvgAcademicDifficulty() { return avgAcademicDifficulty; }
    public void setAvgAcademicDifficulty(Double avgAcademicDifficulty) { this.avgAcademicDifficulty = avgAcademicDifficulty; }
    public Double getAvgCreditTransferability() { return avgCreditTransferability; }
    public void setAvgCreditTransferability(Double avgCreditTransferability) { this.avgCreditTransferability = avgCreditTransferability; }
    public Double getAvgCulture() { return avgCulture; }
    public void setAvgCulture(Double avgCulture) { this.avgCulture = avgCulture; }
    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
}