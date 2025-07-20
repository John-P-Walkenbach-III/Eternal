import React from 'react';
import DailyVerse from '../components/DailyVerse.jsx';
import './DevotionalPage.css';

function DevotionalPage() {
  return (
    <div className="devotional-page">
      <div className="devotional-header">
        <h1>Daily Devotional</h1>
        <p>Take a moment to reflect on the Word and what it means for your life today.</p>
      </div>
      
      {/* The DailyVerse component now handles everything for this page */}
      <DailyVerse />
    </div>
  );
}

export default DevotionalPage;