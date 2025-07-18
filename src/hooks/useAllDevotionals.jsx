import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useAllDevotionals = () => {
  const [allDevotionals, setAllDevotionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const devotionalRef = collection(db, 'devotionals');
        const querySnapshot = await getDocs(devotionalRef);

        const fetchedDevotionals = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort numerically by ID since Firestore IDs are strings
        fetchedDevotionals.sort((a, b) => Number(a.id) - Number(b.id));

        setAllDevotionals(fetchedDevotionals);
      } catch (err) {
        console.error("Error fetching all devotionals:", err);
        setError("Could not load devotional list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { allDevotionals, loading, error };
};