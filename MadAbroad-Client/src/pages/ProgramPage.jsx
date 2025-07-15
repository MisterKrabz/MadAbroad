import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRatingDisplay from '../components/StarRatingDisplay';
import ReviewCard from '../components/ReviewCard';
import './ProgramPage.css';

function ProgramPage() {
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch program details and reviews in parallel
                const [programResponse, reviewsResponse] = await Promise.all([
                    fetch(`http://localhost:8080/api/programs/${programId}`),
                    fetch(`http://localhost:8080/api/programs/${programId}/reviews`)
                ]);

                if (!programResponse.ok || !reviewsResponse.ok) {
                    throw new Error('Failed to load program data.');
                }

                const programData = await programResponse.json();
                const reviewsData = await reviewsResponse.json();

                setProgram(programData);
                setReviews(reviewsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgramData();
    }, [programId]);

    if (isLoading) {
        return <div className="program-page-container"><p>Loading Program...</p></div>;
    }

    if (error) {
        return <div className="program-page-container"><p className="error-message">{error}</p></div>;
    }

    if (!program) {
        return <div className="program-page-container"><p>Program not found.</p></div>;
    }

    const ratingCategories = [
        { label: 'Overall Rating', value: program.avgRating },
        { label: 'Social Scene', value: program.avgSocialScene },
        { label: 'Academic Difficulty', value: program.avgAcademicDifficulty },
        { label: 'Credit Transferability', value: program.avgCreditTransferability },
        { label: 'Culture Shock', value: program.avgCulture },
    ];

    return (
        <div className="program-page-container">
            <header className="program-page-header">
                <h1>{program.programUniversityName}</h1>
                <p className="location">{program.city}, {program.country}</p>
                <a href={program.link} target="_blank" rel="noopener noreferrer" className="official-link">
                    Visit Official Program Website
                </a>
            </header>

            <section className="ratings-summary-section">
                <h2>Ratings Summary</h2>
                {program.reviewCount > 0 ? (
                    <div className="summary-grid">
                        {ratingCategories.map(cat => (
                            <div key={cat.label} className="summary-item">
                                <span className="summary-label">{cat.label}</span>
                                <div className="summary-stars">
                                    <StarRatingDisplay rating={cat.value} />
                                    <span className="summary-value">{cat.value.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews yet. Be the first to share your experience!</p>
                )}
            </section>

            <section className="reviews-list-section">
                <h2>Reviews ({program.reviewCount})</h2>
                <div className="reviews-list">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default ProgramPage;