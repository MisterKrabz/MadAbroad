import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';
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
        {programs.map(program => (
          // Adapt the backend's camelCase properties to the props the ProgramCard expects
          <ProgramCard 
            key={program.id} 
            program={{
              id: program.id,
              program_university_name: program.programUniversityName,
              city: program.city,
              country: program.country,
              terms: program.terms,
              language: program.language,
              areas_of_focus: program.areasOfFocus
            }} 
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