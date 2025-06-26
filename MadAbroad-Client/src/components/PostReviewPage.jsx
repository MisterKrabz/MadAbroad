import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PostReviewPage() {
  // The 'useParams' hook reads the dynamic parameters from the URL.
  // It will be { programId: '8' } for the path '/post-a-review/8'
  // and {} for the path '/post-a-review'.
  const { programId } = useParams();

  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This effect runs if a programId is found in the URL
    if (programId) {
      setIsLoading(true);
      // In a real app, you would fetch the program data from your API
      // fetch(`/api/programs/${programId}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     setProgram(data);
      //     setIsLoading(false);
      //   });

      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setProgram({ id: programId, name: `Program #${programId} Name` });
        setIsLoading(false);
      }, 500);
    }
  }, [programId]); // This effect re-runs only if the programId changes

  return (
    <div className="review-page-container">
      <h1>Post a Review</h1>

      {isLoading && <p>Loading program details...</p>}

      {/* If a program is pre-selected (from URL or user search), show its name */}
      {program && <h2>Reviewing: {program.name}</h2>}

      {/* If no program is selected, show a search box */}
      {!programId && !program && (
        <div className="program-search-container">
          <h3>Selected Program</h3>
          {/* You would implement a program search component here */}
          <input type="" placeholder="Search for a program..." />
        </div>
      )}

      {/* The actual review form would go here.
        It would be enabled once a 'program' is selected.
      */}
      <form>
        {/* ... rating inputs, text areas, etc. ... */}
      </form>
    </div>
  );
}

export default PostReviewPage;