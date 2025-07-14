import React, { useState } from 'react';
import '../App.css';
import './Explore.css';
import ProgramCard from './ProgramCard'; // We'll need this to display results

function Explore() {
    // State for each filter input
    const [focus, setFocus] = useState('Any Focus Area');
    const [term, setTerm] = useState('Any Term');
    const [language, setLanguage] = useState('Any Language');
    const [location, setLocation] = useState('');

    // State for managing the results
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

    // Static options for filters
    const termOptions = ['Any Term', 'Fall', 'Spring', 'Summer', 'Winter Intersession', 'Full Year'];
    const focusOptions = [ 'Any Focus Area', 'Arts & Humanities', 'Business', 'Engineering', 'Education', 'Global Health', 'Social Sciences', 'Science & Technology'];
    const languageOptions = ['Any Language', 'English', 'Spanish', 'German', 'Russian'];

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        // Build the query string from the state
        const params = new URLSearchParams();
        if (focus && focus !== 'Any Focus Area') params.append('focus', focus);
        if (term && term !== 'Any Term') params.append('term', term);
        if (language && language !== 'Any Language') params.append('language', language);
        if (location) params.append('location', location);

        try {
            const response = await fetch(`http://localhost:8080/api/programs/search?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Something went wrong with the search.');
            }
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="explore-section" id="explore">
            <h2 className="section-title">Explore Programs</h2>
            
            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="focus-area-filter">Area of Focus</label>
                    <select id="focus-area-filter" value={focus} onChange={e => setFocus(e.target.value)}>
                        {focusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="term-filter">Term</label>
                    <select id="term-filter" value={term} onChange={e => setTerm(e.target.value)}>
                        {termOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="language-filter">Language</label>
                    <select id="language-filter" value={language} onChange={e => setLanguage(e.target.value)}>
                        {languageOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="location-search">Country or City</label>
                    <input type="text" id="location-search" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Australia" />
                </div>
                <button className="filter-button" onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* NEW: Results Section */}
            <div className="explore-results-container">
                {isLoading && <p className="results-message">Loading results...</p>}
                {error && <p className="results-message error">{error}</p>}
                {!isLoading && !error && hasSearched && results.length === 0 && (
                    <p className="results-message">No programs found matching your criteria.</p>
                )}
                {!isLoading && !error && results.length > 0 && (
                    <div className="results-scroll-container">
                        {results.map(program => (
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
                )}
            </div>
        </section>
    );
}

export default Explore;