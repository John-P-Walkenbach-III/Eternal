import React, { useState, useEffect } from "react"
import './DailyVerse.css';

function DailyVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchVerse = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      try {
        // We add a timestamp to prevent the browser from caching the result
        const response = await fetch(`https://bible-api.com/?random=verse&_=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the verse of the day from the external API.");
        }
        const data = await response.json();
        setVerse({ text: data.text.trim(), reference: data.reference });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching daily verse:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerse();
  }, []);

  if (loading)
    return (
      <div className="daily-verse-container">
        <h3>Verse of the Day</h3>
        <p>Loading verse...</p>
      </div>
    );

  if (error)
    return (
      <div className="daily-verse-container">
        <h3>Verse of the Day</h3>
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <section className="daily-verse-container">
      <div className="verse-header">
        <h3>Verse of the Day</h3>
      </div>
      <blockquote className="verse-text">"{verse.text}"</blockquote>
      <cite className="verse-reference">{verse.reference}</cite>
    </section>
  );
};

export default DailyVerse;
