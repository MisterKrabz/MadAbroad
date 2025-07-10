// In src/components/ProgramResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProgramCard from './ProgramCard';
import './ProgramResultsPage.css';

function ProgramResultsPage() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPrograms = async () => {
      // Get the search query from URL, or default to empty to show all programs
      const query = searchParams.get('q') || '';
      
      try {
        // Make a request to your live backend search endpoint
        const response = await fetch(`http://localhost:8080/api/programs/search?q=${query}`);

        if (!response.ok) {
          throw new Error('Data could not be fetched!');
        }
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [searchParams]); // Re-run this logic every time the URL search query changes

  let content;
  if (isLoading) {
    content = <p>Loading programs...</p>;
  } else if (error) {
    content = <p>Error: {error}</p>;
  } else if (programs.length === 0) {
    content = <p>No programs found matching your criteria.</p>;
  } else {
    content = (
      <div className="results-grid">
        {/* This is much cleaner. I'm passing the program object directly 
          without changing its structure.
        */}
        {programs.map(program => (
          <ProgramCard 
            key={program.id} 
            program={program}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="results-page-container">
      <h1 className="results-title">Search Results</h1>
      {content}
    </div>
  );
}

export default ProgramResultsPage;