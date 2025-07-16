import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const scoresRef = collection(db, 'game_scores');
        const q = query(scoresRef, orderBy('highScore', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);

        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScores(leaderboardData);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Could not load leaderboard data. Please check permissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return { scores, loading, error };
};