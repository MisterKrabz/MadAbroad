import React from 'react';
import '../App.css';
import './FeaturedReviews.css';
import ProgramCard from './ProgramCard';

// MOCK DATA: Based on your database schema.
// This array serves as a stand-in for the data you will eventually fetch from your API.
const featuredPrograms = [
  {
    "id": 1,
    "city": "BUENOS AIRES",
    "country": "ARGENTINA",
    "program_university_name": "CIEE COMMUNITY PUBLIC HEALTH",
    "areas_of_focus": "ARTS & HUMANITIES, GLOBAL HEALTH, SOCIAL SCIENCES",
    "language": "SPANISH",
    "terms": "SUMMER"
  },
  {
    "id": 3,
    "city": "BUENOS AIRES",
    "country": "ARGENTINA",
    "program_university_name": "IFSA ARGENTINA STUDY ABROAD PROGRAM",
    "areas_of_focus": "SOCIAL SCIENCES, ARTS & HUMANITIES",
    "language": "SPANISH",
    "terms": "SPRING, SUMMER, FALL, YEAR"
  },
  {
    "id": 8,
    "city": "BRISBANE",
    "country": "AUSTRALIA",
    "program_university_name": "UNIVERSITY OF QUEENSLAND EXCHANGE",
    "areas_of_focus": "ARTS & HUMANITIES, BUSINESS, ENGINEERING",
    "language": "ENGLISH",
    "terms": "FALL, SPRING, CALENDAR YEAR"
  },
  {
    "id": 14,
    "city": "SYDNEY",
    "country": "AUSTRALIA",
    "program_university_name": "UNIVERSITY OF SYDNEY EXCHANGE",
    "areas_of_focus": "AGRICULTURE, ARTS & HUMANITIES, BUSINESS",
    "language": "ENGLISH",
    "terms": "FALL, SPRING, CALENDAR YEAR"
  }
];

function FeaturedReviews() {
  return (
    <section className="featured-reviews" id="featured-reviews">
      <h2 className="section-title">Featured Reviews:</h2>
      <div className="program-cards-container">
        {/* Iterate over the 'featuredPrograms' array. For each 'program' object:
          1. Render a 'ProgramCard' component.
          2. Pass the entire 'program' object as a prop.
          3. Use the unique 'program.id' as the 'key' prop, a requirement for React's list rendering optimization.
        */}
        {featuredPrograms.map(program => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedReviews;