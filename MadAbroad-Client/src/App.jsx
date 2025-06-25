import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Featured from './components/FeaturedReviews';


function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Featured />
    </div>
  );
}

export default App;