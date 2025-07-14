import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { useAuth } from './auth/AuthContext';

// Import all your components
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedReviews from './components/FeaturedReviews';
import Explore from './components/Explore';
import About from './components/About';
import Footer from './components/Footer';
import PostReviewPage from './components/PostReviewPage';
import ProgramResultsPage from './components/ProgramResultsPage';
// NEW: Import new pages
import SignInPage from './pages/SignInPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ProfilePage from './pages/ProfilePage'; // <-- Import ProfilePage

// A helper component for the homepage layout
const HomePage = ({ heroSearchInputRef }) => (
  <>
    <Hero ref={heroSearchInputRef} /> 
    <FeaturedReviews />
    <Explore />
    <About/>
  </>
);

// A wrapper to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};


function App() {
  const heroSearchInputRef = useRef(null);

  const handleSearchClick = () => {
    if (heroSearchInputRef.current) {
      heroSearchInput_ref.current.focus();
    }
  };
  
  return (
    <Router>
      <Header onSearchClick={handleSearchClick} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage heroSearchInputRef={heroSearchInputRef} />} />
          <Route path="/search-results" element={<ProgramResultsPage />} />
          <Route path="/signin" element={<SignInPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route 
            path="/post-a-review" 
            element={<ProtectedRoute><PostReviewPage /></ProtectedRoute>} 
          />
          <Route 
            path="/post-a-review/:programId" 
            element={<ProtectedRoute><PostReviewPage /></ProtectedRoute>} 
          />
          <Route 
            path="/complete-profile"
            element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>}
          />
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;