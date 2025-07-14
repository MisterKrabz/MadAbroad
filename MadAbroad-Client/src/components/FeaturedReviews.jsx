import React, { useState, useEffect } from 'react';
import '../App.css';
import './FeaturedReviews.css';
import ReviewCard from './ReviewCard';

function FeaturedReviews() {
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      setIsLoading(true);
      setError(null); 
      try {
        // THIS IS THE CORRECTED URL
        const response = await fetch('http://localhost:8080/api/reviews/trending');
        
        if (!response.ok) {
          throw new Error('Failed to fetch trending reviews.');
        }
        const data = await response.json();
        setFeaturedReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedReviews();
  }, []); 

  let content;
  if (isLoading) {
    content = <p id="loading">Loading trending reviews...</p>;
  } else if (error) {
    content = <p id="error">Could not load reviews at this time.</p>;
  } else if (featuredReviews.length === 0) {
    content = <p id="no-reviews">No reviews have been posted yet. Be the first!</p>;
  } else {
    content = featuredReviews.map(review => (
      <ReviewCard key={review.id} review={review} showProgramName={true} />
    ));
  }

  return (
    <section className="featured-reviews" id="featured-reviews">
      <h2 className="section-title">Trending Reviews:</h2>
      <div className="program-cards-container">
        {content}
      </div>
    </section>
  );
}

export default FeaturedReviews;