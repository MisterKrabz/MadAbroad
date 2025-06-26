import React from 'react';
import '../App.css';      // For the global .section-title class
import './Explore.css';  // For this component's specific styles

function Explore() {
  // Static options for filters. In a production app, these would be fetched
  // from an API to ensure they are always up-to-date with database values.
  const termOptions = ['Any Term', 'Fall', 'Spring', 'Summer', 'Winter Intersession', 'Full Year'];
  const focusOptions = [
    'Any Focus Area', 'Arts & Humanities', 'Business', 'Engineering',
    'Education', 'Global Health', 'Social Sciences', 'Science & Technology'
  ];
  const languageOptions = ['Any Language', 'English', 'Spanish', 'German', 'Russian'];

  return (
    <section className="explore-section" id = "explore">
      <h2 className="section-title">Explore Programs</h2>
      
      <div className="filters-container">
        {/* Filter by Area of Focus */}
        <div className="filter-group">
          <label htmlFor="focus-area-filter">Area of Focus</label>
          <select id="focus-area-filter">
            {focusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Filter by Term */}
        <div className="filter-group">
          <label htmlFor="term-filter">Term</label>
          <select id="term-filter">
            {termOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Filter by Language */}
        <div className="filter-group">
          <label htmlFor="language-filter">Language</label>
          <select id="language-filter">
            {languageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Search by Location */}
        <div className="filter-group">
          <label htmlFor="location-search">Country or City</label>
          <input type="text" id="location-search" placeholder="e.g., Australia" />
        </div>

        {/* Action Button */}
        <button className="filter-button">Search</button>
      </div>
    </section>
  );
}

export default Explore;