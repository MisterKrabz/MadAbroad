import React from 'react';
import './StarRatingDisplay.css';

const StarRatingDisplay = ({ rating }) => {
    // Gracefully handle null or undefined ratings
    const validRating = typeof rating === 'number' ? rating : 0;

    const fullStars = Math.floor(validRating);
    const halfStar = validRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
        <div className="star-rating-display">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star filled">★</span>)}
            {halfStar === 1 && <span key="half" className="star half">★</span>}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star empty">★</span>)}
        </div>
    );
};

export default StarRatingDisplay;