import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import './PostReviewPage.css';

const Star = ({ selected, onSelect, onHover, onLeaveHover }) => (
    <span className={`star ${selected ? 'selected' : ''}`} onClick={onSelect} onMouseEnter={onHover} onMouseLeave={onLeaveHover}>
        ★
    </span>
);

function PostReviewPage() {
    const { programId: initialProgramId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [allPrograms, setAllPrograms] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState(initialProgramId || '');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [personalAnecdote, setPersonalAnecdote] = useState(''); 
    const [images, setImages] = useState([]);
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
        setIsLoading(true);
        fetch('http://localhost:8080/api/programs')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch programs');
                return res.json();
            })
            .then(data => {
                data.sort((a, b) => a.programUniversityName.localeCompare(b.programUniversityName));
                setAllPrograms(data);
            })
            .catch(() => setError('Could not load programs.'))
            .finally(() => setIsLoading(false));
    }, []);

    const handleProgramChange = (e) => {
        const newProgramId = e.target.value;
        setSelectedProgramId(newProgramId);
        navigate(`/post-a-review/${newProgramId}`, { replace: true });
    };

    const handleImageChange = (e) => {
        if (e.target.files) setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewData = { rating, socialScene, academicDifficulty, creditTransferability, culture, title, personalAnecdote };
        const formData = new FormData();
        formData.append('review', JSON.stringify(reviewData));
        if (images.length > 0) {
            images.forEach(file => formData.append('files', file));
        }

        try {
            const response = await fetch(`http://localhost:8080/api/programs/${selectedProgramId}/reviews`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
                throw new Error(errorData.message || 'Failed to submit review.');
            }
            alert('Thank you! Your review has been successfully posted.');
            navigate('/');
        } catch (error) {
            alert(`Failed to submit review: ${error.message}`);
        }
    };

    const isFormValid = selectedProgramId && title && personalAnecdote && rating > 0 && socialScene > 0 && academicDifficulty > 0 && creditTransferability > 0 && culture > 0;

    return (
        <div className="review-page-container">
            <h1>Post a Review</h1>
            <form onSubmit={handleSubmit} className="review-form">
                <fieldset disabled={isLoading}>
                    <div className="form-group">
                        <label htmlFor="program-select" className="form-label">Program to be reviewed<span className="required">*</span></label>
                        <select id="program-select" className="form-input" value={selectedProgramId} onChange={handleProgramChange} required>
                            <option value="" disabled>-- Select a Program --</option>
                            {allPrograms.map(program => <option key={program.id} value={program.id}>{program.programUniversityName}</option>)}
                        </select>
                        {error && <p style={{color: 'red'}}>{error}</p>}
                    </div>
                    <div className="form-group"><label className="form-label">Overall Rating<span className="required">*</span></label><div className="star-rating-container" onMouseLeave={() => setHoverRating(0)}>{[1, 2, 3, 4, 5].map(v => <Star key={v} selected={v <= (hoverRating || rating)} onSelect={() => setRating(v)} onHover={() => setHoverRating(v)} />)}</div></div>
                    <div className="form-group"><label className="form-label">Social Scene<span className="required">*</span></label><div className="star-rating-container" onMouseLeave={() => setHoverSocialScene(0)}>{[1, 2, 3, 4, 5].map(v => <Star key={v} selected={v <= (hoverSocialScene || socialScene)} onSelect={() => setSocialScene(v)} onHover={() => setHoverSocialScene(v)} />)}</div></div>
                    <div className="form-group"><label className="form-label">Academic Difficulty<span className="required">*</span></label><div className="star-rating-container" onMouseLeave={() => setHoverAcademicDifficulty(0)}>{[1, 2, 3, 4, 5].map(v => <Star key={v} selected={v <= (hoverAcademicDifficulty || academicDifficulty)} onSelect={() => setAcademicDifficulty(v)} onHover={() => setHoverAcademicDifficulty(v)} />)}</div></div>
                    <div className="form-group"><label className="form-label">Credit Transferability<span className="required">*</span></label><div className="star-rating-container" onMouseLeave={() => setHoverCreditTransferability(0)}>{[1, 2, 3, 4, 5].map(v => <Star key={v} selected={v <= (hoverCreditTransferability || creditTransferability)} onSelect={() => setCreditTransferability(v)} onHover={() => setHoverCreditTransferability(v)} />)}</div></div>
                    <div className="form-group"><label className="form-label">Culture Shock<span className="required">*</span></label><div className="star-rating-container" onMouseLeave={() => setHoverCulture(0)}>{[1, 2, 3, 4, 5].map(v => <Star key={v} selected={v <= (hoverCulture || culture)} onSelect={() => setCulture(v)} onHover={() => setHoverCulture(v)} />)}</div></div>
                    <div className="form-group"><label htmlFor="title" className="form-label">Review Title<span className="required">*</span></label><input type="text" id="title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., An Unforgettable Semester!" required /></div>
                    <div className="form-group"><label htmlFor="Personal-Anecdote" className="form-label">Personal Anecdote<span className="required">*</span></label><textarea id="Personal-Anecdote" className="form-textarea" value={personalAnecdote} onChange={(e) => setPersonalAnecdote(e.target.value)} placeholder="Share details of your experience..." required /></div>
                    <div className="form-group"><label htmlFor="image-upload" className="image-upload-label">Click to upload photos (optional)</label><input type="file" id="image-upload" multiple accept="image/png, image/jpeg" onChange={handleImageChange} style={{display: 'none'}} />{images.length > 0 && <div className="image-preview"><strong>Selected files:</strong>{images.map(file => <span key={file.name}>{file.name}</span>)}</div>}</div>
                    <button type="submit" className="submit-button" disabled={!isFormValid || isLoading}>Submit Review</button>
                </fieldset>
            </form>
        </div>
    );
}

export default PostReviewPage;