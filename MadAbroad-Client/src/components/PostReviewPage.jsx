import React, { useState, useEffect } from 'react';
// useNavigate is needed to update the URL when the user selects a program
import { useParams, useNavigate } from 'react-router-dom';
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
    // The 'useParams' hook reads the dynamic parameters from the URL.
    // It will be { programId: '8' } for the path '/post-a-review/8'
    // and {} for the path '/post-a-review'.
    const { programId: initialProgramId } = useParams();
    const navigate = useNavigate();

    // State for the program dropdown
    const [allPrograms, setAllPrograms] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState(initialProgramId || '');
    const [isLoading, setIsLoading] = useState(true); // Set to true initially to show loading state for the program list
    const [error, setError] = useState('');

    // State for the form fields based on the Review model
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [personalAnecdote, setPersonalAnecdote] = useState(''); 
    const [images, setImages] = useState([]);
    const [wiscEmail, setWiscEmail] = useState('');

    // State for all 5 rating categories
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

    // This effect fetches the list of all programs from the backend when the component mounts then sorts things by alphabetical order
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

    // This function is called when the user selects a program from the dropdown
    const handleProgramChange = (e) => {
        const newProgramId = e.target.value;
        setSelectedProgramId(newProgramId);
        // Update the URL to match the selection without reloading the page
        navigate(`/post-a-review/${newProgramId}`, { replace: true });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // This data structure must match the backend's Review model
        const reviewData = {
            author,
            rating,
            socialScene,
            academicDifficulty,
            creditTransferability,
            amountOfCultureShock,
            title,
            personalAnecdote,
            wiscEmail
        };

        // Use FormData for multipart requests (JSON + files)
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
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit review: ${errorText}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            alert('Thank you for your review! Please check your email to verify and publish it.');
            navigate('/'); // Redirect to homepage on success
        
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message);
        }
    };

    // Find the currently selected program object from the fetched list
    const selectedProgram = allPrograms.find(p => p.id.toString() === selectedProgramId);

    // Form validity check 
    const isFormValid = selectedProgram &&
        author && 
        title &&
        rating > 0 &&
        socialScene > 0 &&
        academicDifficulty > 0 &&
        creditTransferability > 0 &&
        amountOfCultureShock > 0 &&
        wiscEmail;

    return (
        <div className="review-page-container">
            <h1>Post a Review</h1>

            {isLoading && <p>Loading programs...</p>}
            <form onSubmit={handleSubmit} className="review-form">
                {/* The form is disabled only while the initial program list is loading */}
                <fieldset disabled={isLoading}>
                    {/* Program to be reviewed */}
                    <div className="form-group">
                        <label htmlFor="program-select" className="form-label">Program to be reviewed<span className="required">*</span></label>
                        <select
                            id="program-select"
                            className="form-select" // You might want to add styling for .form-select
                            value={selectedProgramId}
                            onChange={handleProgramChange}
                            required
                        >
                            <option value="" disabled>
                                -- Select a Program --
                            </option>
                            {allPrograms.map(program => (
                                <option key={program.id} value={program.id}>
                                    {/* CHANGE 'program.name' to 'program.programUniversityName' */}
                                    {program.programUniversityName}
                                </option>
                            ))}
                        </select>
                        {error && <p style={{color: 'red'}}>{error}</p>}
                    </div>

                    {/* OVERALL RATING */}
                    <div className="form-group">
                        <label className="form-label">Overall Rating<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star
                                key={starValue}
                                selected={starValue <= (hoverRating || rating)}
                                onSelect={() => setRating(starValue)}
                                onHover={() => setHoverRating(starValue)}
                            />
                        ))}
                        </div>
                    </div>

                    {/* SOCIAL SCENE */}
                    <div className="form-group">
                        <label className="form-label">Social Scene<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverSocialScene(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star
                                key={starValue}
                                selected={starValue <= (hoverSocialScene || socialScene)}
                                onSelect={() => setSocialScene(starValue)}
                                onHover={() => setHoverSocialScene(starValue)}
                            />
                        ))}
                        </div>
                    </div>

                    {/* ACADEMIC DIFFICULTY */}
                    <div className="form-group">
                        <label className="form-label">Academic Difficulty<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverAcademicDifficulty(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star
                                key={starValue}
                                selected={starValue <= (hoverAcademicDifficulty || academicDifficulty)}
                                onSelect={() => setAcademicDifficulty(starValue)}
                                onHover={() => setHoverAcademicDifficulty(starValue)}
                            />
                        ))}
                        </div>
                    </div>

                    {/*CREDIT TRANSFERABILITY*/}
                    <div className="form-group">
                        <label className="form-label">Credit Transferability<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverCreditTransferability(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star
                                key={starValue}
                                selected={starValue <= (hoverCreditTransferability || creditTransferability)}
                                onSelect={() => setCreditTransferability(starValue)}
                                onHover={() => setHoverCreditTransferability(starValue)}
                            />
                        ))}
                        </div>
                    </div>

                    {/*AMOUNT OF CULTURAL SHOCK*/}
                    <div className="form-group">
                        <label className="form-label">Amount of Cultural Shock<span className="required">*</span></label>
                        <div className="star-rating-container" onMouseLeave={() => setHoverAmountOfCultureShock(0)}>
                        {[1, 2, 3, 4, 5].map(starValue => (
                            <Star
                                key={starValue}
                                selected={starValue <= (hoverAmountOfCultureShock || amountOfCultureShock)}
                                onSelect={() => setAmountOfCultureShock(starValue)}
                                onHover={() => setHoverAmountOfCultureShock(starValue)}
                            />
                        ))}
                        </div>
                    </div>

                    {/* TITLE */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Review Title<span className="required">*</span></label>
                        <input
                            type="text"
                            id="title"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., An Unforgettable Semester!"
                            required
                        />
                    </div>

                    {/* Personal Anecdote */}
                    <div className="form-group">
                        <label htmlFor="Personal-Anecdote" className="form-label">Personal Anecdote</label>
                        <textarea
                            id="Personal-Anecdote"
                            className="form-textarea"
                            value={personalAnecdote}
                            onChange={(e) => setPersonalAnecdote(e.target.value)}
                            placeholder="Share details of your experience. What were the academics, housing, and social life like?"
                        />
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div className="form-group">
                        <label htmlFor="image-upload" className="form-label">Upload Photos</label>
                        <label htmlFor="image-upload" className="image-upload-label">
                            Click to select images
                        </label>
                        <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/png, image/jpeg"
                            onChange={handleImageChange}
                            style={{display: 'none'}}
                        />
                        {images.length > 0 && (
                        <div className="image-preview">
                            <strong>Selected files:</strong>
                            {images.map(file => <span key={file.name}>{file.name}</span>)}
                        </div>
                        )}
                    </div>
                    {/* author */}
                    <div className="form-group">
                        <label htmlFor="author" className="form-label">Your Name<span className="required">*</span></label>
                        <input
                            type="text"
                            id="author"
                            className="form-input"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="e.g., Bucky Badger"
                            required
                        />
                    </div>
                    {/* WISC EMAIL */}
                    <div className="form-group">
                        <label htmlFor="wisc-email" className="form-label">enter your @wisc.edu email for a verification link</label>
                        <input
                            type="email"
                            id="wisc-email"
                            className="form-input"
                            value={wiscEmail}
                            onChange={(e) => setWiscEmail(e.target.value)}
                            placeholder="a verification link will be sent to this address"
                        ></input>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button type="submit" className="submit-button" disabled={!isFormValid || isLoading}>
                        Submit Review
                    </button>
                </fieldset>
            </form>
        </div>
    );
}

export default PostReviewPage;