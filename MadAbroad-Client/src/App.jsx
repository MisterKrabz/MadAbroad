import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import layout and shared components
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedReviews from './components/FeaturedReviews';
import Explore from './components/Explore';
import About from './components/About';
import Footer from './components/Footer';

// --- Best Practice: Create these page components in a new 'src/pages' folder ---

// 1. Define a component for your Home Page
const HomePage = () => (
  <>
    <Hero />
    <FeaturedReviews />
    <Explore /> {/* You can decide if Explore stays on the homepage or moves */}
    <About/>
    <Footer/>
  </>
);

// 2. Define placeholder components for your new pages
const ExplorePage = () => (
  <div style={{ padding: '2rem 3rem' }}>
    <h1>Explore All Programs</h1>
    <p>The full exploration and filtering page will be built here.</p>
  </div>
);

const PostReviewPage = () => (
  <div style={{ padding: '2rem 3rem' }}>
    <h1>Post a Review</h1>
    <p>The form for posting a review will be built here.</p>
  </div>
);

const AboutPage = () => (
  <div style={{ padding: '2rem 3rem' }}>
    <h1>About Mad Abroad</h1>
    <p>Information about the project will go here.</p>
  </div>
);


function App() {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            {/* 3. Update your routes to point to the new page components */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/post-a-review" element={<PostReviewPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Optional: Add a catch-all 404 page */}
            <Route path="*" element={
              <div style={{ padding: '2rem 3rem' }}>
                <h1>404: Page Not Found</h1>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;