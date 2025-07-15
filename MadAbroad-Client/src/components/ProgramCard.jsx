import React from "react";
import { Link } from "react-router-dom";
import './ProgramCard.css';
import StarRatingDisplay from "./StarRatingDisplay";

function ProgramCard({ program }) {
  if (!program) {
    return null;
  }

  const { 
    id, 
    programUniversityName, 
    city, 
    country, 
    avgRating, 
    reviewCount 
  } = program;

  const location = `${city?.toLowerCase()}, ${country?.toLowerCase()}`;
  const programDetailLink = `/programs/${id}`;

  return (
    <Link to={programDetailLink} className="program-card-link">
      <div className="program-card">
        <div>
          <h3 className="program-title">{programUniversityName}</h3>
          
          {/* Always show stars, change text based on review count */}
          <div className="program-rating-summary">
            <StarRatingDisplay rating={avgRating} />
            <span className="review-count">
              {reviewCount > 0 ? `(${reviewCount} reviews)` : "(No reviews yet)"}
            </span>
          </div>
          
          <p className="program-location">{location}</p>
        </div>
        <span className="program-link-button">Read Reviews</span>
      </div>
    </Link>
  );
}

export default ProgramCard;