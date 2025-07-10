package com.patrickwang.MadAbroad.model;

// This is a simple data-carrier class.
// Using a record is a modern, concise way to create an immutable DTO.
public record ProgramDTO(
    Long id,
    String programUniversityName
) {
    // The record automatically generates a constructor, getters, equals(), hashCode(), and toString().
}