import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { FaHeart, FaCrown } from 'react-icons/fa';
import './HallOfFaithPage.css';

const HallOfFaithPage = () => {
  const [topVerses, setTopVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopVerses = async () => {
      try {
        const versesRef = collection(db, 'devotionals');
        const q = query(versesRef, orderBy('likeCount', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);

        const verses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTopVerses(verses);
      } catch (err) {
        console.error("Error fetching top verses:", err);
        setError("Could not load the Hall of Faith. Please check back later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopVerses();
  }, []);

  if (isLoading) {
    return <div className="hall-of-faith-container"><p>Loading the most cherished verses...</p></div>;
  }

  if (error) {
    return <div className="hall-of-faith-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="hall-of-faith-container">
      <h1>Hall of Faith</h1>
      <p className="subtitle">The top 10 most-liked verses, chosen by the community.</p>
      <ol className="verse-leaderboard">
        {topVerses.map((verse, index) => (
          <li key={verse.id} className="verse-card">
            <span className="rank">{index === 0 ? <FaCrown /> : `#${index + 1}`}</span>
            <blockquote className="verse-text">"{verse.text}"</blockquote>
            <cite className="verse-reference">{verse.reference}</cite>
            <div className="like-count"><FaHeart /> {verse.likeCount}</div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default HallOfFaithPage;