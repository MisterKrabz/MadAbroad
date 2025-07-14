import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Import useAuth
import './PostReviewPage.css';

// reusable Star component for ratings
const Star = ({ selected, onSelect, onHover, onLeaveHover }) => (
    <span
        className={`star ${selected ? 'selected' : ''}`}
        onClick={onSelect}
        onMouseEnter={onHover}
        onMouseLeave={onLeaveHover}
    >
        ★
    </span>
);

function PostReviewPage() {
    const { programId: initialProgramId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth(); // Get the authentication token

    // State for the program dropdown
    const [allPrograms, setAllPrograms] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState(initialProgramId || '');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the form fields based on the Review model
    // Author and WiscEmail are removed
    const [title, setTitle] = useState('');
    const [personalAnecdote, setPersonalAnecdote] = useState(''); 
    const [images, setImages] = useState([]);

    // State for all 5 rating categories
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [socialScene, setSocialScene] = useState(0);
    const [hoverSocialScene, setHoverSocialScene] = useState(0);
    const [academicDifficulty, setAcademicDifficulty] = useState(0);
    const [hoverAcademicDifficulty, setHoverAcademicDifficulty] = useState(0);
    const [creditTransferability, setCreditTransferability] = useState(0);
    const [hoverCreditTransferability, setHoverCreditTransferability] = useState(0);
    const [culture, setCulture] = useState(0);
    const [hoverCulture, setHoverCulture] = useState(0);

    useEffect(() => {
        const fetchPrograms = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/programs');
                if (!response.ok) {
                    throw new Error(`Failed to fetch programs: ${response.status}`);
                }
                const data = await response.json();
            
                data.sort((a, b) => a.programUniversityName.localeCompare(b.programUniversityName));

                setAllPrograms(data);
                setError('');
            } catch (err) {
                console.error("Error fetching programs:", err);
                setError('Could not load programs. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    const handleProgramChange = (e) => {
        const newProgramId = e.target.value;
        setSelectedProgramId(newProgramId);
        navigate(`/post-a-review/${newProgramId}`, { replace: true });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            rating,
            socialScene,
            academicDifficulty,
            creditTransferability,
            culture,
            title,
            personalAnecdote,
        };

        const formData = new FormData();
        formData.append('review', JSON.stringify(reviewData));
        
        if (images.length > 0) {
            images.forEach(file => {
                formData.append('files', file); 
            });
        }

        try {
            const response = await fetch(`http://localhost:8080/api/programs/${selectedProgramId}/reviews`, {
                method: 'POST',
                headers: {
                    // Include the JWT for authentication
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit review: ${errorText}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            alert('Thank you! Your review has been successfully posted.');
            navigate('/'); // Redirect to homepage on success
        
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message);
        }
    };

    const selectedProgram = allPrograms.find(p => p.id.toString() === selectedProgramId);

    const isFormValid = selectedProgram &&
        title &&
        personalAnecdote &&
        rating > 0 &&
        socialScene > 0 &&
        academicDifficulty > 0 &&
        creditTransferability > 0 &&
        culture > 0;

    return (
        <div className="review-page-container">
            <h1>Post a Review</h1>

            {isLoading && <p>Loading programs...</p>}
            <form onSubmit={handleSubmit} className="review-form">
                <fieldset disabled={isLoading}>
                    <div className="form-group">
                        <label htmlFor="program-select" className="form-label">Program to be reviewed<span className="required">*</span></label>
                        <select
                            id="program-select"
                            className="form-input"
                            value={selectedProgramId}
                            onChange={handleProgramChange}
                            required
                        >
                            <option value="" disabled>
                                -- Select a Program --
                            </option>
                            {allPrograms.map(program => (
                                <option key={program.id} value={program.id}>
                                    {program.programUniversityName}
                                </option>
                            ))}
                        </select>
                        {error && <p style={{color: 'red'}}>{error}</p>}
                    </div>

                    {/* All 5 star rating sections remain the same */}
                    <div className="form-group">
                        <label className="form-label">Overall Rating<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star key={starValue} selected={starValue <= (hoverRating || rating)} onSelect={() => setRating(starValue)} onHover={() => setHoverRating(starValue)} />
                        ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Social Scene<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverSocialScene(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star key={starValue} selected={starValue <= (hoverSocialScene || socialScene)} onSelect={() => setSocialScene(starValue)} onHover={() => setHoverSocialScene(starValue)} />
                        ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Academic Difficulty<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverAcademicDifficulty(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star key={starValue} selected={starValue <= (hoverAcademicDifficulty || academicDifficulty)} onSelect={() => setAcademicDifficulty(starValue)} onHover={() => setHoverAcademicDifficulty(starValue)} />
                        ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Credit Transferability<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverCreditTransferability(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star key={starValue} selected={starValue <= (hoverCreditTransferability || creditTransferability)} onSelect={() => setCreditTransferability(starValue)} onHover={() => setHoverCreditTransferability(starValue)} />
                        ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Amount of Cultural Shock<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverCulture(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star key={starValue} selected={starValue <= (hoverCulture || culture)} onSelect={() => setCulture(starValue)} onHover={() => setHoverCulture(starValue)} />
                        ))}
                        </div>
                    </div>
                    
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Review Title<span className="required">*</span></label>
                        <input type="text" id="title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., An Unforgettable Semester!" required />
                    </div>

                    {/* Personal Anecdote */}
                    <div className="form-group">
                        <label htmlFor="Personal-Anecdote" className="form-label">Personal Anecdote<span className="required">*</span></label>
                        <textarea id="Personal-Anecdote" className="form-textarea" value={personalAnecdote} onChange={(e) => setPersonalAnecdote(e.target.value)} placeholder="Share details of your experience. What were the academics, housing, and social life like?" required />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label htmlFor="image-upload" className="image-upload-label">
                            Click to upload photos (optional)
                        </label>
                        <input type="file" id="image-upload" multiple accept="image/png, image/jpeg" onChange={handleImageChange} style={{display: 'none'}} />
                        {images.length > 0 && (
                        <div className="image-preview">
                            <strong>Selected files:</strong>
                            {images.map(file => <span key={file.name}>{file.name}</span>)}
                        </div>
                        )}
                    </div>
                    
                    {/* REMOVED Author and Wisc Email fields */}

                    <button type="submit" className="submit-button" disabled={!isFormValid || isLoading}>
                        Submit Review
                    </button>
                </fieldset>
            </form>
        </div>
    );
}

export default PostReviewPage;