import React, { useState, useEffect } from "react";

function DailyVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        // This is a free API, no key required.
        const response = await fetch(
          "https://beta.ourmanna.com/api/v1/get?format=json&order=daily"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the verse of the day.");
        }
        const data = await response.json();
        setVerse(data.verse.details);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []); // Empty dependency array means this runs once on mount

  if (loading)
    return (
      <div className="daily-verse-container">
        <p>Loading inspirational verse...</p>
      </div>
    );
  if (error)
    return (
      <div className="daily-verse-container">
        <p className="status-message error">
          Could not load verse. Please try again later.
        </p>
      </div>
    );

  return (
    <section className="daily-verse-container">
      <h3>Verse of the Day</h3>
      <blockquote className="verse-text">"{verse.text}"</blockquote>
      <cite className="verse-reference">{verse.reference}</cite>
    </section>
  );
}

export default DailyVerse;
