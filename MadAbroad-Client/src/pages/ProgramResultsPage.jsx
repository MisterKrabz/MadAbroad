import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';
import './ProgramResultsPage.css'; // <-- THIS IMPORT IS THE CRITICAL FIX

function ProgramResultsPage() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      const query = searchParams.get('q') || '';
      
      try {
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
  }, [searchParams]);

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
          <ProgramCard key={program.id} program={program} />
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