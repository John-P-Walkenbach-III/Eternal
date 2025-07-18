import React from 'react';
import { Link } from 'react-router-dom';
import { useDevotional } from '../hooks/useDevotional';
import { FaBookOpen, FaFeatherAlt, FaSpinner } from 'react-icons/fa';
import './DevotionalPage.css';

const DevotionalPage = () => {
  const { devotional, loading, error } = useDevotional();

  if (loading) {
    return (
      <div className="devotional-page">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading Today's Devotional...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="devotional-page">
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // This is a safeguard. If loading is done and there's no error, but also no devotional,
  // it means we haven't found the content. This prevents a crash.
  if (!devotional) {
    return (
        <div className="devotional-page">
            <div className="error-container">
                <p>Could not retrieve today's devotional data.</p>
            </div>
        </div>
    );
  }
  // Create a pre-filled journal entry link
  const journalLink = `/journal?prompt=${encodeURIComponent(
    `Reflection on "${devotional.title}":\n\n${devotional.scripture}\n\nMy thoughts:\n`
  )}`;

  return (
    <div className="devotional-page">
      <div className="devotional-card">
        <h1 className="devotional-title">{devotional.title}</h1>
        <p className="devotional-date">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="scripture-section">
          <h2><FaBookOpen /> Today's Scripture</h2>
          <blockquote className="scripture-text">"{devotional.scripture}"</blockquote>
          <cite className="scripture-reference">- {devotional.reference}</cite>
        </div>

        <div className="reflection-section">
          <h2>Reflection</h2>
          <p className="reflection-text">{devotional.reflection}</p>
        </div>
        
        <Link to={journalLink} className="journal-cta-button">
          <FaFeatherAlt /> Write in Your Journal
        </Link>
      </div>
    </div>
  );
};

export default DevotionalPage;