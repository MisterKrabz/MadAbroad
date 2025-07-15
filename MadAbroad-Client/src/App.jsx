import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { useAuth } from './auth/authContext';

// Import all your components
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedReviews from './components/FeaturedReviews';
import Explore from './components/Explore';
import About from './components/About';
import Footer from './components/Footer';
import PostReviewPage from './components/PostReviewPage';
import ProgramResultsPage from './pages/ProgramResultsPage'; // <-- IMPORT IS HERE
import SignInPage from './pages/SignInPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ProfilePage from './pages/ProfilePage';
import ProgramPage from './pages/ProgramPage';

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
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};


function App() {
  const heroSearchInputRef = useRef(null);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage heroSearchInputRef={heroSearchInputRef} />} />
          <Route path="/search-results" element={<ProgramResultsPage />} /> {/* <-- ROUTE IS NOW ACTIVE */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/programs/:programId" element={<ProgramPage />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/post-a-review" element={<ProtectedRoute><PostReviewPage /></ProtectedRoute>} />
          <Route path="/post-a-review/:programId" element={<ProtectedRoute><PostReviewPage /></ProtectedRoute>} />
          <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;