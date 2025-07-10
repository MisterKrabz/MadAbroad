import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedReviews from './components/FeaturedReviews'; // Changed back
import Explore from './components/Explore';
import About from './components/About';
import Footer from './components/Footer';
import PostReviewPage from './components/PostReviewPage';
import ProgramResultsPage from './components/ProgramResultsPage';

// A helper component for the homepage layout
const HomePage = ({ heroSearchInputRef }) => (
  <>
    <Hero ref={heroSearchInputRef} /> 
    <FeaturedReviews /> {/* Changed back */}
    <Explore />
    <About/>
  </>
);

function App() {
  const heroSearchInputRef = useRef(null);

  const handleSearchClick = () => {
    if (heroSearchInputRef.current) {
      heroSearchInputRef.current.focus();
    }
  };
  
  return (
    <Router>
      <Header onSearchClick={handleSearchClick} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage heroSearchInputRef={heroSearchInputRef} />} />
          <Route path="/post-a-review" element={<PostReviewPage />} />
          <Route path="/post-a-review/:programId" element={<PostReviewPage />} />
          <Route path="/search-results" element={<ProgramResultsPage />} />
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;