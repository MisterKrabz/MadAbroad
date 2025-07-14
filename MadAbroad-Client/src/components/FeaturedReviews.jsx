import React, { useState, useEffect } from 'react';
import '../App.css';
import './FeaturedReviews.css';
import ReviewCard from './ReviewCard'; // Import the new ReviewCard

function FeaturedReviews() {
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      setIsLoading(true);
      try {
        // Fetch from the backend endpoint for featured reviews
        const response = await fetch('http://localhost:8080/api/reviews/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured reviews.');
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
  }, []); // Empty array ensures this runs once when the component mounts

  let content;
  if (isLoading) {
    content = <p id = "loading">Loading trending reviews...</p>;
  } else if (error) {
    content = <p id = "error">Could not load reviews at this time.</p>;
  } else if (featuredReviews.length === 0) {
    content = <p id = "no-reviews">No verified reviews have been posted yet. Be the first!</p>;
  } else {
    // Map over the review data and render a ReviewCard for each one
    content = featuredReviews.map(review => (
      <ReviewCard key={review.id} review={review} />
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