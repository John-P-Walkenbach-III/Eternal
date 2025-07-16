import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export const useJournal = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const journalCollectionRef = collection(db, 'journals', currentUser.uid, 'entries');
    const q = query(journalCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(fetchedEntries);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching journal entries:", err);
      setError("Failed to load journal entries.");
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [currentUser]);

  const addJournalEntry = useCallback(async (content) => {
    if (!currentUser) return;
    const journalCollectionRef = collection(db, 'journals', currentUser.uid, 'entries');
    await addDoc(journalCollectionRef, { content, createdAt: Timestamp.now() });
  }, [currentUser]);

  const deleteJournalEntry = useCallback(async (entryId) => {
    if (!currentUser) return;
    const entryDocRef = doc(db, 'journals', currentUser.uid, 'entries', entryId);
    await deleteDoc(entryDocRef);
  }, [currentUser]);

  return { entries, loading, error, addJournalEntry, deleteJournalEntry };
};