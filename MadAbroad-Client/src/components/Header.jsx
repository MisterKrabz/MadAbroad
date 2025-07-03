import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { HashLink as Link } from 'react-router-hash-link';

import '../App.css';
import logo from '../assets/logo.png'; 
import searchIcon from '../assets/searchIcon.png'; 
import './Header.css'; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Add this useEffect hook
  useEffect(() => {
    // This function will be called whenever isMenuOpen changes
    if (isMenuOpen) {
      // When the menu is open, disable scrolling on the body
      document.body.style.overflow = 'hidden';
    } else {
      // When the menu is closed, re-enable scrolling
      document.body.style.overflow = 'auto';
    }

    // This is a "cleanup function" that runs when the component unmounts
    // It ensures that scrolling is re-enabled if the user navigates away
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]); // The effect depends on the isMenuOpen state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header-container">
      <Link to="/" className="logo-container" onClick={closeMenu}>
        <img src={logo} alt="Mad Abroad Logo" className="logo-img"/>
      </Link>

      <nav className="nav-links">
        <Link smooth to="/#featured-reviews">Featured</Link> 
        <Link smooth to="/#explore">Explore</Link>
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

      <nav className={`mobile-nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link smooth to="/#featured-reviews" onClick={closeMenu}>Featured</Link>
        <Link smooth to="/#explore" onClick={closeMenu}>Explore</Link>
        <Link smooth to="/#about" onClick={closeMenu}>About</Link>
        <Link to="/post-a-review" onClick={closeMenu}>Post a Review</Link>
        <Link to="/#hero" onClick={closeMenu}>Search</Link>
      </nav>
    </header>
  );
}

export default Header;