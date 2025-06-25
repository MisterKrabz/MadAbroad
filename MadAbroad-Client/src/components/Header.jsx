import React, { useState } from 'react';
import '../App.css';
import logo from '../assets/logo.png'; 
import searchIcon from '../assets/searchIcon.png'; 
import './Header.css'; 

function Header() {
  // State to manage whether the mobile menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={logo} alt="Mad Abroad Logo" className="logo-img"/>
      </div>

      {/* --- Desktop Navigation --- */}
      <nav className="nav-links">
        <a href="#featured">Featured</a>
        <a href="#explore">Explore</a>
        <a href="#post-review">Post a Review</a>
        <a href="#about">About</a>
      </nav>

      {/* --- Desktop Search Icon --- */}
      <div className="search-icon-container">
        <img src={searchIcon} alt="Search Icon" className="search-icon-img"/>
      </div>

      {/* --- Hamburger Menu Button (for mobile) --- */}
      <button 
        className={`hamburger-icon ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      {/* --- Mobile Dropdown Menu --- */}
      <nav className={`mobile-nav-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="#featured">Featured</a>
        <a href="#explore">Explore</a>
        <a href="#post-review">Post a Review</a>
        <a href="#about">About</a>
        <a href="#search">Search</a>
      </nav>
    </header>
  );
}

export default Header;
