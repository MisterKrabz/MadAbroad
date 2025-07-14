import React from 'react';
import './ReviewCard.css';

// Reusable Star component for displaying ratings
const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </div>
  );
};

// Helper to format the date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function ReviewCard({ review }) {
  if (!review) {
    return null;
  }

  // Create an array of all rating types to easily map over them
  const ratings = [
    { label: 'Overall', value: review.rating },
    { label: 'Social Scene', value: review.socialScene },
    { label: 'Academic Difficulty', value: review.academicDifficulty },
    { label: 'Credit Transferability', value: review.creditTransferability },
    { label: 'Culture Shock', value: review.culture },
  ];

  return (
    <div className="review-card">
      {/* --- Header: Title and Author --- */}
      <div className="review-card-header">
        <h3 className="review-title">{review.title}</h3>
        <span className="review-date">{formatDate(review.reviewDate)}</span>
      </div>
      <p className="review-author-line">
        {/* MODIFIED: Get author name from the nested user object */}
        by <strong>{review.user ? review.user.name : 'Anonymous'}</strong> for <strong>{review.program.programUniversityName}</strong>
      </p>

      {/* --- Main Content: Anecdote --- */}
      <p className="review-anecdote">{review.personalAnecdote}</p>

      {/* --- Detailed Ratings Section --- */}
      <div className="detailed-ratings-container">
        {ratings.map(r => (
          r.value > 0 && // Only display ratings that have a value
          <div key={r.label} className="rating-item">
            <span className="rating-label">{r.label}</span>
            <StarRating rating={r.value} />
          </div>
        ))}
      </div>

      {/* --- Image Gallery Section --- */}
      {review.imageUrls && review.imageUrls.length > 0 && (
        <div className="review-image-gallery">
          {review.imageUrls.map((url, index) => (
            <img key={index} src={`http://localhost:8080${url}`} alt={`Review photo ${index + 1}`} className="review-image-thumbnail" />
          ))}
        </div>
      )}

      {/* --- Footer: Helpful count and Report link --- */}
      <div className="review-card-footer">
        <span className="helpful-count">{review.helpful} people found this helpful</span>
        <a href="#/report" className="report-link">Report</a>
      </div>
    </div>
  );
}

export default ReviewCard;