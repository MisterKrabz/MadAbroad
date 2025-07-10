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
      try {
        setIsLoading(true);
        // The API endpoint is the same
        const response = await fetch('http://localhost:8080/api/reviews/trending');
        if (!response.ok) {
          throw new Error('Could not connect to the server.');
        }
        const data = await response.json();
        setFeaturedReviews(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching featured reviews:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedReviews();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <p className="status-message">Loading reviews...</p>;
    }
    if (error) {
      return <p className="status-message error-message">Could not load featured reviews.</p>;
    }
    if (featuredReviews.length === 0) {
      return <p className="status-message">No featured reviews available yet.</p>;
    }
    
    return featuredReviews.map(review => (
      <ReviewCard key={review.id} review={review} />
    ));
  };

  return (
    <section className="featured-reviews" id="featured-reviews">
      <h2 className="section-title">Featured Reviews:</h2>
      <div className="program-cards-container">
        {renderContent()}
      </div>
    </section>
  );
}

export default FeaturedReviews;