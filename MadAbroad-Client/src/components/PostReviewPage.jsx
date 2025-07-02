import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './PostReviewPage.css';

// A reusable Star component for ratings
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
  const { programId } = useParams();

  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for the form fields based on the Review model
  const [title, setTitle] = useState('');
  const [personalAnecdote, setPersonalAnecdote] = useState(''); // Renamed from 'comment'
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

  const [amountOfCultureShock, setAmountOfCultureShock] = useState(0);
  const [hoverAmountOfCultureShock, setHoverAmountOfCultureShock] = useState(0);

  // State to hold the CAPTCHA token
  const [captchaToken, setCaptchaToken] = useState(null);

  useEffect(() => {
    // This effect runs if a programId is found in the URL
    if (programId) {
      setIsLoading(true);
      // In a real app, you would fetch the program data from your API
      // For now, we'll simulate it.
      setTimeout(() => {
        setProgram({ id: programId, name: `Program #${programId}` });
        setIsLoading(false);
      }, 500);
    }
  }, [programId]);

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // This data structure now matches your updated Review.java model
    const reviewData = {
      rating,
      socialScene,
      academicDifficulty,
      creditTransferability,
      amountOfCultureShock,
      title,
      personalAnecdote,
      // 'helpful' and 'reviewDate' are set by the backend
    };

    // Use FormData for multipart requests (JSON + files)
    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }));
    
    if (images.length > 0) {
      images.forEach(file => {
        formData.append('files', file); // Use 'files' to match @RequestParam
      });
    }

    try {
      // Send the request to your live backend endpoint
      const response = await fetch(`http://localhost:8080/api/programs/${program.id}/reviews`, {
        method: 'POST',
        body: formData, // The browser will automatically set the Content-Type header
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit review: ${errorText}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('Thank you for your review! It has been submitted successfully.');
      // Here you would typically redirect the user
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message);
    }
  };

  // The form validity check now includes all required ratings
  const isFormValid = program &&
    title &&
    rating > 0 &&
    socialScene > 0 &&
    academicDifficulty > 0 &&
    creditTransferability > 0 &&
    amountOfCultureShock > 0 &&
    captchaToken;

  return (
    <div className="review-page-container">
      <h1>Post a Review</h1>

      {isLoading && <p>Loading program details...</p>}
      {program && <h2>Reviewing: {program.name}</h2>}

      {/* The rest of your JSX form remains exactly the same as you provided it. */}
      {/* ... no changes needed for the return() part of your component ... */}
      <form onSubmit={handleSubmit} className="review-form">
        <fieldset disabled={!program || isLoading}>
          {/* RATING */}
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
            />
            {images.length > 0 && (
              <div className="image-preview">
                <strong>Selected files:</strong>
                {images.map(file => <span key={file.name}>{file.name}</span>)}
              </div>
            )}
          </div>

          <div className="form-group">
            <HCaptcha
              sitekey="ES_71abd0b115a14a2cb395177b074639f8"
              onVerify={handleCaptchaVerify}
              onExpire={() => setCaptchaToken(null)}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="submit-button" disabled={!isFormValid}>
            Submit Review
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default PostReviewPage;