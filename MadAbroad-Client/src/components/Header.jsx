import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import { NavLink, Link } from 'react-router-dom'; // Use Link for the profile icon
import { useAuth } from '../auth/AuthContext';

import '../App.css';
import logo from '../assets/logo.png';
// Using an inline SVG for the profile icon to avoid needing a new file
const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

import './Header.css'; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header-container">
      <Link to="/" className="logo-container" onClick={closeMenu}>
        <img src={logo} alt="Mad Abroad Logo" className="logo-img"/>
      </Link>

      {/* Desktop Navigation */}
      <nav className="nav-links">
        <HashLink smooth to="/#featured-reviews">Featured</HashLink> 
        <HashLink smooth to="/#explore">Explore</HashLink>
        <NavLink to="/post-a-review">Post a Review</NavLink>
        <HashLink smooth to="/#about">About</HashLink>
      </nav>

      {/* Profile Icon Logic */}
      <Link to={user ? "/profile" : "/signin"} className="profile-icon-container">
        <ProfileIcon />
      </Link>

      {/* Hamburger Icon for Mobile */}
      <button 
        className={`hamburger-icon ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav-links ${isMenuOpen ? 'active' : ''}`}>
        <HashLink smooth to="/#featured-reviews" onClick={closeMenu}>Featured</HashLink>
        <HashLink smooth to="/#explore" onClick={closeMenu}>Explore</HashLink>
        <HashLink smooth to="/#about" onClick={closeMenu}>About</HashLink>
        <NavLink to="/post-a-review" onClick={closeMenu}>Post a Review</NavLink>
        <hr className="mobile-nav-divider" />
        {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu}>My Profile</NavLink>
              <a href="#" onClick={() => { closeMenu(); logout(); }}>Sign Out</a>
            </>
        ) : (
            <NavLink to="/signin" onClick={closeMenu}>Sign In</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;