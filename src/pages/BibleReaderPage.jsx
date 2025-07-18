import React, { useState } from 'react';
import './BibleReaderPage.css';
import { FaBookOpen } from 'react-icons/fa';

function BibleReaderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setVerseData(null);

    try {
      const response = await fetch(`https://bible-api.com/${searchTerm}?translation=web`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Verse not found. Please check the reference (e.g., "John 3:16").`);
        }
        throw new Error('Failed to fetch verse. Please try again.');
      }
      const data = await response.json();
      setVerseData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching verse:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bible-reader-page">
      <header className="reader-header">
        <h1><FaBookOpen /> Bible Reader</h1>
        <p>Look up any passage in the World English Bible.</p>
      </header>

      <form onSubmit={handleSearch} className="reader-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a verse (e.g., Romans 8:28)"
          className="reader-input"
        />
        <button type="submit" className="reader-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="reader-results">
        {loading && <p>Loading...</p>}
        {error && <p className="status-message error">{error}</p>}
        {verseData && (
          <div className="verse-display">
            <h2>{verseData.reference}</h2>
            <p>{verseData.text}</p>
          </div>
        )}
        {!loading && !error && !verseData && (
            <p className="initial-prompt">Enter a book, chapter, and verse to begin.</p>
        )}
      </div>
    </div>
  );
}

export default BibleReaderPage;