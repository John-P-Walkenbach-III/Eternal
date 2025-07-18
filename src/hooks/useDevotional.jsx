import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getDayOfYear = () => {
  // This new version uses UTC to avoid local timezone issues.
  const now = new Date();
  // Get the start of the year in UTC
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 0);
  // Get the current time in UTC
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor((today - startOfYear) / oneDay);
};

export const useDevotional = () => {
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevotional = async () => {
      setLoading(true);
      setError(null);
      try {
        // Reverting to hardcoded ID to bypass caching issues and ensure functionality.
        const dayOfYear = 299;
        console.log("Using hardcoded day 299 to ensure the page works.");
        const devotionalDocRef = doc(db, 'devotionals', String(dayOfYear));
        const docSnap = await getDoc(devotionalDocRef);

        if (docSnap.exists()) {
          setDevotional({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Devotional for today not found. Please check back later.');
        }
      } catch (err) {
        console.error("Error fetching devotional:", err);
        setError('Failed to load the daily devotional.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevotional();
  }, []);

  return { devotional, loading, error };
};
