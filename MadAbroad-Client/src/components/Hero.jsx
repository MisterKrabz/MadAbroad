import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css'; 
import '../App.css';

function Hero() {
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    // Get the search query from the input field
    const query = event.target.elements.search.value;
    // Navigate to the results page with the query as a URL parameter
    navigate(`/search-results?q=${query}`);
  };

  return (
    <section className="hero" id="hero"> 
      <div className="hero-content">
        <h1 className="hero-title">Mad Abroad</h1>
        <form className="search-bar-container" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            className="search-bar"
            placeholder="search for reviews on UW Madison's study abroad programs"
          />
        </form>
      </div>
    </section>
  );
}

export default Hero;