package com.patrickwang.MadAbroad.model;

import jakarta.persistence.*; // We import the new Jakarta Persistence APIs

@Entity // This annotation tells Spring Data JPA that this class represents a table in the database.
@Table(name = "programs") // This explicitly names the table "programs".
public class StudyAbroadProgram {

    @Id // Marks this field as the primary key.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tells the database to automatically generate this ID value for us.
    private Long id;

    @Column(nullable = false) // Ensures this column in the database cannot be empty.
    private String programName;

    @Column(nullable = false)
    private String country;
    
    private String city;

    private String university;

    @Lob // Designates this as a "Large Object", suitable for long text descriptions.
    @Column(columnDefinition = "TEXT")
    private String description;

    // A no-argument constructor is required by JPA.
    public StudyAbroadProgram() {
    }

    // Getters and Setters for all fields... (You can generate these in your IDE)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProgramName() { return programName; }
    public void setProgramName(String programName) { this.programName = programName; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

