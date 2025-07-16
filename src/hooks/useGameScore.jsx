import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export const useGameScore = () => {
  const { currentUser } = useAuth();
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchScore = async () => {
      setLoading(true);
      setError(null);
      const scoreDocRef = doc(db, 'game_scores', currentUser.uid);
      try {
        const docSnap = await getDoc(scoreDocRef);
        if (docSnap.exists()) {
          setHighScore(docSnap.data().highScore || 0);
        }
      } catch (err) {
        setError("Could not load high score.");
        console.error("Error fetching high score:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [currentUser]);

  const updateHighScore = async (newScore) => {
    if (!currentUser || newScore <= highScore) {
      return;
    }
    setHighScore(newScore); // Optimistic update
    setError(null);
    const scoreDocRef = doc(db, 'game_scores', currentUser.uid);
    try {
      await setDoc(scoreDocRef, {
        highScore: newScore,
        displayName: currentUser.displayName,
        lastUpdated: new Date(),
      }, { merge: true });
    } catch (err) {
      setError("Could not save new high score.");
      console.error("Error updating high score:", err);
      // Potentially revert optimistic update on error
    }
  };

  return { highScore, loading, error, updateHighScore };
};
