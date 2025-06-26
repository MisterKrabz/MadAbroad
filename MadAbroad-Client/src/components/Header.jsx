import React, { useState } from 'react';
// 1. Import HashLink and rename it to Link for easy replacement
import { HashLink as Link } from 'react-router-hash-link';

import '../App.css';
import logo from '../assets/logo.png'; 
import searchIcon from '../assets/searchIcon.png'; 
import './Header.css'; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // This helper function ensures the menu closes after a link is clicked.
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header-container">
      <Link to="/" className="logo-container" onClick={closeMenu}>
        <img src={logo} alt="Mad Abroad Logo" className="logo-img"/>
      </Link>

      {/* --- Desktop Navigation --- */}
      {/* 2. Update the 'to' prop for on-page links with hashes */}
      <nav className="nav-links">
        {/* The 'smooth' prop enables smooth scrolling! */}
        <Link smooth to="/#featured-reviews">Featured</Link> 
        <Link smooth to="/#explore">Explore</Link>
        <Link to="/post-a-review">Post a Review</Link> {/* This remains a standard link */}
        <Link smooth to="/#about">About</Link>
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

      {/* --- Mobile Dropdown Menu --- */}
      {/* 3. Update mobile links as well */}
      <nav className={`mobile-nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link smooth to="/#featured-reviews" onClick={closeMenu}>Featured</Link>
        <Link smooth to="/#explore" onClick={closeMenu}>Explore</Link>
        <Link to="/post-a-review" onClick={closeMenu}>Post a Review</Link>
        <Link smooth to="/#about" onClick={closeMenu}>About</Link>
        <Link to="/search" onClick={closeMenu}>Search</Link> {/* Assuming you have a /search page */}
      </nav>
    </header>
  );
}

export default Header;