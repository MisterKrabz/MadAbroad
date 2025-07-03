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

    // State for the selected program and the dropdown
    const [program, setProgram] = useState(null);
    const [allPrograms, setAllPrograms] = useState([]); // Will hold all programs for the dropdown
    const [selectedProgramId, setSelectedProgramId] = useState(''); // Holds the ID from the dropdown
    const [isLoading, setIsLoading] = useState(true); // Used for initial data load

    // --- State for the form fields (no changes) ---
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
    const [amountOfCultureShock, setAmountOfCultureShock] = useState(0);
    const [hoverAmountOfCultureShock, setHoverAmountOfCultureShock] = useState(0);

    // This effect now fetches ALL programs once when the component first loads.
    useEffect(() => {
        const fetchAllPrograms = async () => {
            setIsLoading(true);
            try {
                // Use the getAllPrograms endpoint from your ProgramController
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
    }, []); // The empty array [] ensures this runs only once.

    // This function runs when the "Confirm Selection" button is clicked
    const handleProgramSelect = () => {
        if (!selectedProgramId) {
            alert('Please select a program from the list.');
            return;
        }
        // Find the full program object from our list of all programs
        const selected = allPrograms.find(p => p.id.toString() === selectedProgramId);
        if (selected) {
            setProgram({ id: selected.id, name: selected.programUniversityName });
        }
    };

    // --- (No changes to handleImageChange, handleSubmit, or onCaptchaVerify) ---
    const handleImageChange = (e) => {
        if (e.target.files) setImages(Array.from(e.target.files));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        captchaRef.current.execute();
    };
    const onCaptchaVerify = async (token) => {
        const reviewData = {
            program: { id: program.id },
            rating, socialScene, academicDifficulty, creditTransferability, amountOfCultureShock, title, personalAnecdote
        };
        const formData = new FormData();
        formData.append('review', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }));
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
    const isFormValid = program && title && rating > 0 && socialScene > 0 && academicDifficulty > 0 && creditTransferability > 0 && amountOfCultureShock > 0;

    return (
        <div className="review-page-container">
            <h1>Post a Review</h1>

            {/* If a program has been selected, show the form. Otherwise, show the dropdown. */}
            {program ? (
                <>
                    <h2>Reviewing: {program.name}</h2>
                    <form onSubmit={handleSubmit} className="review-form">
                        <fieldset>
                            {/* All form inputs go here */}
                            <div className="form-group">
                                <label className="form-label">Overall Rating<span className="required">*</span></label>
                                <div className="star-rating-container" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverRating || rating)} onSelect={() => setRating(starValue)} onHover={() => setHoverRating(starValue)} />))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Social Scene<span className="required">*</span></label>
                                <div className="star-rating-container" onMouseLeave={() => setHoverSocialScene(0)}>
                                    {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverSocialScene || socialScene)} onSelect={() => setSocialScene(starValue)} onHover={() => setHoverSocialScene(starValue)} />))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Academic Difficulty<span className="required">*</span></label>
                                <div className="star-rating-container" onMouseLeave={() => setHoverAcademicDifficulty(0)}>
                                    {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverAcademicDifficulty || academicDifficulty)} onSelect={() => setAcademicDifficulty(starValue)} onHover={() => setHoverAcademicDifficulty(starValue)} />))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Credit Transferability<span className="required">*</span></label>
                                <div className="star-rating-container" onMouseLeave={() => setHoverCreditTransferability(0)}>
                                    {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverCreditTransferability || creditTransferability)} onSelect={() => setCreditTransferability(starValue)} onHover={() => setHoverCreditTransferability(starValue)} />))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount of Cultural Shock<span className="required">*</span></label>
                                <div className="star-rating-container" onMouseLeave={() => setHoverAmountOfCultureShock(0)}>
                                    {[1, 2, 3, 4, 5].map(starValue => (<Star key={starValue} selected={starValue <= (hoverAmountOfCultureShock || amountOfCultureShock)} onSelect={() => setAmountOfCultureShock(starValue)} onHover={() => setHoverAmountOfCultureShock(starValue)} />))}
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
                                <label htmlFor="image-upload" className="form-label">Upload Photos</label>
                                <label htmlFor="image-upload" className="image-upload-label">Click to select images</label>
                                <input type="file" id="image-upload" multiple accept="image/png, image/jpeg" onChange={handleImageChange} />
                                {images.length > 0 && <div className="image-preview"><strong>Selected files:</strong>{images.map(file => <span key={file.name}>{file.name}</span>)}</div>}
                            </div>
                            <HCaptcha ref={captchaRef} size="invisible" sitekey="YOUR_PUBLISHER_SITEKEY_HERE" onVerify={onCaptchaVerify} />
                            <button type="submit" className="submit-button" disabled={!isFormValid}>Submit Review</button>
                        </fieldset>
                    </form>
                </>
            ) : (
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
                                    <option key={p.id} value={p.id}>
                                        {p.programUniversityName} - {p.city}, {p.country}
                                    </option>
                                ))}
                            </select>
                            <button type="button" className="submit-button" onClick={handleProgramSelect}>
                                Confirm Selection
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostReviewPage;