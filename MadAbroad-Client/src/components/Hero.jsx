import React from 'react';
import './Hero.css'; 
import '../App.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Mad Abroad</h1>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="search for reviews on UW Madison's study abroad programs"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;