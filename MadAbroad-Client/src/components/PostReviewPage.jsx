import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './PostReviewPage.css';

// Star component (no changes needed)
const Star = ({ selected, onSelect, onHover, onLeaveHover }) => (
  <span className={`star ${selected ? 'selected' : ''}`} onClick={onSelect} onMouseEnter={onHover} onMouseLeave={onLeaveHover}>★</span>
);

function PostReviewPage() {
    const { programId } = useParams();
    const captchaRef = useRef(null);
    const [program, setProgram] = useState(null);
    const [allPrograms, setAllPrograms] = useState([]); 
    const [selectedProgramId, setSelectedProgramId] = useState(''); 
    const [isLoading, setIsLoading] = useState(true); 
    const [title, setTitle] = useState('');
    const [personalAnecdote, setPersonalAnecdote] = useState('');
    const [images, setImages] = useState([]);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [social, setSocial] = useState(0); 
    const [hoverSocial, setHoverSocial] = useState(0); 
    const [academicDifficulty, setAcademicDifficulty] = useState(0);
    const [hoverAcademicDifficulty, setHoverAcademicDifficulty] = useState(0);
    const [culture, setCulture] = useState(0); 
    const [hoverCulture, setHoverCulture] = useState(0); 

    useEffect(() => {
        const fetchAllPrograms = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/programs`);
                if (!response.ok) throw new Error('Could not fetch program list.');
                const data = await response.json();
                setAllPrograms(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllPrograms();
    }, []);

    useEffect(() => {
        if (selectedProgramId && allPrograms.length > 0) {
            const selected = allPrograms.find(p => p.id.toString() === selectedProgramId);
            setProgram(selected ? { id: selected.id, name: selected.programUniversityName } : null);
        } else {
            setProgram(null);
        }
    }, [selectedProgramId, allPrograms]);

    // This is the corrected, simpler function for handling file selection.
    // It replaces the old selection with the new one, which is standard and reliable.
    const handleImageChange = (e) => {
        if (e.target.files) {
            if (e.target.files.length > 9) {
                alert("You can only upload a maximum of 9 photos.");
                return;
            }
            setImages(Array.from(e.target.files));
        }
    };
    
    // This function correctly removes an image from the array.
    const handleRemoveImage = (imageNameToRemove) => {
        setImages(currentImages => currentImages.filter(image => image.name !== imageNameToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        captchaRef.current.execute();
    };
    
    const onCaptchaVerify = async (token) => {
        const reviewData = {
            program: { id: program.id },
            rating, social, academicDifficulty, culture, title, personalAnecdote
        };

        const formData = new FormData();
        formData.append('review', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }));
        formData.append('h-captcha-response', token);
        images.forEach(file => formData.append('files', file));

        try {
            const response = await fetch(`http://localhost:8080/api/reviews`, { method: 'POST', body: formData });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit review: ${errorText}`);
            }
            const result = await response.json();
            console.log('Success:', result);
            alert('Thank you! Your review has been submitted.');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message);
        }
    };

    const isFormValid = program && title && rating > 0 && social > 0 && academicDifficulty > 0 && culture > 0;

    return (
        <div className="review-page-container">
            <h1>Post a Review</h1>
            <div className="program-search-container">
                <h3>Select a Program to Review</h3>
                {isLoading ? (
                    <p>Loading programs...</p>
                ) : (
                    <div className="form-group">
                        <select
                            className="form-input"
                            value={selectedProgramId}
                            onChange={(e) => setSelectedProgramId(e.target.value)}
                        >
                            <option value="">-- Please choose a program --</option>
                            {allPrograms.map(p => (
                                <option key={p.id} value={p.id.toString()}>
                                    {p.programUniversityName} - {p.city}, {p.country}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {program && (
                <>
                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="form-group">
                            <label className="form-label">Overall Rating<span className="required">*</span></label>
                            <div className="star-rating-container" onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverRating || rating)} onSelect={() => setRating(starValue)} onHover={() => setHoverRating(starValue)} />))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Social Life<span className="required">*</span></label>
                            <div className="star-rating-container" onMouseLeave={() => setHoverSocial(0)}>
                                {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverSocial || social)} onSelect={() => setSocial(starValue)} onHover={() => setHoverSocial(starValue)} />))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Academic Difficulty<span className="required">*</span></label>
                            <div className="star-rating-container" onMouseLeave={() => setHoverAcademicDifficulty(0)}>
                                {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverAcademicDifficulty || academicDifficulty)} onSelect={() => setAcademicDifficulty(starValue)} onHover={() => setHoverAcademicDifficulty(starValue)} />))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Culture Shock<span className="required">*</span></label>
                            <div className="star-rating-container" onMouseLeave={() => setHoverCulture(0)}>
                                {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverCulture || culture)} onSelect={() => setCulture(starValue)} onHover={() => setHoverCulture(starValue)} />))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Review Title<span className="required">*</span></label>
                            <input type="text" id="title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., An Unforgettable Semester!" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Personal-Anecdote" className="form-label">Personal Anecdote</label>
                            <textarea id="Personal-Anecdote" className="form-textarea" value={personalAnecdote} onChange={(e) => setPersonalAnecdote(e.target.value)} placeholder="Share details of your experience. What were the academics, housing, and social life like?" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image-upload" className="form-label">Upload Photos (up to 9)</label>
                            <label htmlFor="image-upload" className="image-upload-label">Click to select images</label>
                            <input type="file" id="image-upload" multiple accept="image/png, image/jpeg" onChange={handleImageChange} style={{ display: 'none' }} />
                            
                            {images.length > 0 && (
                              <div className="image-preview">
                                <strong>Selected files:</strong>
                                {images.map((image) => (
                                  <div key={image.name} className="image-preview-item">
                                    <span className="image-name">{image.name}</span>
                                    <button
                                      type="button"
                                      className="remove-image-btn"
                                      onClick={() => handleRemoveImage(image.name)}
                                      aria-label={`Remove ${image.name}`}
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                        <HCaptcha ref={captchaRef} size="invisible" sitekey="5f299195-23f2-411a-845a-6415843b0704" onVerify={onCaptchaVerify} />
                        <button type="submit" className="submit-button" disabled={!isFormValid}>Submit Review</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default PostReviewPage;