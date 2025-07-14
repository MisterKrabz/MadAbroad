import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import ReviewCard from '../components/ReviewCard';
import './ProfilePage.css';

function ProfilePage() {
    const { user, token, logout } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/users/me/reviews', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch your reviews.');
                }

                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserReviews();
    }, [token]);

    if (!user) {
        return <p>You must be logged in to view this page.</p>;
    }

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <h1>{user.name}'s Profile</h1>
                <p>{user.email}</p>
                <button onClick={logout} className="signout-button">Sign Out</button>
            </div>

            <div className="profile-reviews-section">
                <h2>Your Reviews</h2>
                {isLoading && <p>Loading your reviews...</p>}
                {error && <p className="error-message">{error}</p>}
                {!isLoading && !error && reviews.length === 0 && (
                    <p>You haven't posted any reviews yet.</p>
                )}
                <div className="reviews-grid">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} showProgramName={true} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;