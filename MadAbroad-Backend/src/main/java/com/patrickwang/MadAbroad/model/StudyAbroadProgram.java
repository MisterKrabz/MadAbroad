/*
 * this class is a blueprint model for defining what a "Study Abroad Program" is for the database 
 */

package com.patrickwang.MadAbroad.model;

import jakarta.persistence.Column; // We import the new Jakarta Persistence APIs
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // This annotation tells Spring Data JPA that this class represents a table in the database.
@Table(name = "programs") // This explicitly names the table "programs".
public class StudyAbroadProgram {

    @Id // Marks this field as the primary key.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tells the database to automatically generate this ID value for us.
    private Long id;

    @Column(nullable = false) // Ensures this column in the database cannot be empty.
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


    // A no-argument constructor is required by JPA.
    public StudyAbroadProgram() {
    }

    // Getters and Setters for all fields... (You can generate these in your IDE)
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
}

