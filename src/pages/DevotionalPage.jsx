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

      <DailyVerse />

      <hr className="section-divider" />

      <section className="devotional-content">
        <h2>Today's Reflection</h2>
        <p>
          <em>
            (This is where the devotional text or a video embed would go. 
            In the future, this could be loaded from a Firestore collection.)
          </em>
        </p>
      </section>
    </div>
  );
}

export default DevotionalPage;