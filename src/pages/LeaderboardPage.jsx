import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './LeaderboardPage.css';
import { FaTrophy } from 'react-icons/fa';

function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, 'leaderboard');
        const q = query(scoresCollection, orderBy('score', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const scoresData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setScores(scoresData);
      } catch (error) {
        console.error("Error fetching leaderboard scores: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="leaderboard-page">
      <h1><FaTrophy /> Leaderboard</h1>
      <p>Top 10 Verse Scramblers</p>
      {loading ? (
        <p>Loading scores...</p>
      ) : (
        <ol className="leaderboard-list">
          {scores.map((score, index) => (
            <li key={score.id} className="leaderboard-item">
              <span className="rank">{index + 1}</span>
              <span className="name">{score.displayName}</span>
              <span className="score">{score.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default LeaderboardPage;