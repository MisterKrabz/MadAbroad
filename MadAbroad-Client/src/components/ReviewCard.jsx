import React from 'react';
import './ReviewCard.css'; // We will create this file next

// A re-usable star rating display component
const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="star-rating-display">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </div>
  );
};

function ReviewCard({ review }) {
  if (!review) {
    return null;
  }

  // Truncate long anecdotes for the card view
  const snippet = review.personalAnecdote && review.personalAnecdote.length > 150
    ? `${review.personalAnecdote.substring(0, 150)}...`
    : review.personalAnecdote;

  return (
    <div className="review-card">
      <div className="review-card-header">
        <h3 className="review-title">{review.title}</h3>
        {review.program && (
             <p className="review-program-name">
                for {review.program.programUniversityName}
             </p>
        )}
      </div>
      <div className="review-card-body">
        <StarRatingDisplay rating={review.rating} />
        <p className="review-snippet">"{snippet}"</p>
      </div>
      <div className="review-card-footer">
        <span className="helpful-count">👍 {review.helpful} found this helpful</span>
        <a href={`/reviews/${review.id}`} className="read-more-link">Read More</a>
      </div>
    </div>
  );
}

export default ReviewCard;