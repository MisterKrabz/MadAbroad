import React from "react";
import './ProgramCard.css'; 

/**
 * A reusable card component to display study abroad program information.
 * @param {{ program: object }} props - The props object.
 * @param {object} props.program - An object containing the program details.
 */
function ProgramCard({ program }) {
  // Defensive check: render nothing if program data is missing.
  if (!program) {
    return null;
  }

  // Format location for consistent capitalization.
  const location = `${program.city.toLowerCase()}, ${program.country.toLowerCase()}`;

  // This would be a dynamic link in a full application, e.g., `/reviews/${program.id}`
  const reviewLink = `#explore/${program.id}`;

  return (
    <div className="program-card">
      <div>
        {/* I'm now using the camelCase property directly from the API */}
        <h3 className="program-title">{program.programUniversityName}</h3>
        <p className="program-location">{location}</p>
        <p className="program-details">
          <strong>Terms:</strong> {program.terms}
        </p>
        <p className="program-details">
          <strong>Languages:</strong> {program.language}
        </p>
        <p className="program-details">
            {/* I'm now using the camelCase property directly from the API */}
          <strong>Areas of Focus:</strong> {program.areasOfFocus}
        </p>
      </div>
      <a href={reviewLink} className="program-link">Read More</a>
    </div>
  );
}

export default ProgramCard;