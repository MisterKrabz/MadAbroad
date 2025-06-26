import React, { useState, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import '../App.css';
import logo from '../assets/logo.png'; 
import searchIcon from '../assets/searchIcon.png'; 
import './Header.css'; 

// 1. Receive the onSearchClick prop
function Header({ onSearchClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);
  
  // 2. Create a new handler to call both functions
  const handleSearchAndClose = () => {
    closeMenu(); // Close the mobile menu
    if(onSearchClick) {
      onSearchClick(); // Call the focus function from App.jsx
    }
  };

  return (
    <header className="header-container">
      <Link to="/" className="logo-container" onClick={closeMenu}>
        <img src={logo} alt="Mad Abroad Logo" className="logo-img"/>
      </Link>

      <nav className="nav-links">
        {/* ... desktop links ... */}
      </nav>

      <div className="search-icon-container">
        <img src={searchIcon} alt="Search Icon" className="search-icon-img"/>
      </div>

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

      <nav className={`mobile-nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link smooth to="/#featured-reviews" onClick={closeMenu}>Featured</Link>
        <Link smooth to="/#explore" onClick={closeMenu}>Explore</Link>
        <Link smooth to="/#about" onClick={closeMenu}>About</Link>
        <Link to="/post-a-review" onClick={closeMenu}>Post a Review</Link>
        {/* 3. Update the Search link's onClick */}
        <Link smooth to="/#hero" onClick={handleSearchAndClose}>Search</Link>
      </nav>
    </header>
  );
}

export default Header;