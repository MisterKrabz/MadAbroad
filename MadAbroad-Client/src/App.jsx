import React, { useRef } from 'react'; // 1. Import useRef
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import all your components
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedReviews from './components/FeaturedReviews';
import Explore from './components/Explore';
import About from './components/About';
import Footer from './components/Footer';
import PostReviewPage from './components/PostReviewPage';

// A helper component for the homepage layout
const HomePage = ({ heroSearchInputRef }) => (
  <>
    {/* 4. Pass the ref down to the Hero component */}
    <Hero ref={heroSearchInputRef} /> 
    <FeaturedReviews />
    <Explore />
    <About/>
  </>
);


function App() {
  // 2. Create a ref that will hold the hero's search input
  const heroSearchInputRef = useRef(null);

  // 3. Create the function that will be called from the header
  const handleSearchClick = () => {
    // Check if the ref is attached to an element
    if (heroSearchInputRef.current) {
      // If so, focus it!
      heroSearchInputRef.current.focus();
    }
  };
  
  return (
    <Router>
      {/* 5. Pass the handler function to the Header */}
      <Header onSearchClick={handleSearchClick} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage heroSearchInputRef={heroSearchInputRef} />} />
          <Route path="/post-a-review" element={<PostReviewPage />} />
          {/* Add any other routes here */}
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;