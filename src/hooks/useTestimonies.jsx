import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db} from '../firebase';
import { useAuth } from '../context/AuthContext';

export const useTestimonies = () => {
  const { currentUser } = useAuth();
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const pageSize = 5; // Number of testimonies per page

  // Effect to get total count of all testimonies
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const collectionRef = collection(db, 'testimonies');
        const snapshot = await getCountFromServer(collectionRef);
        setTotalCount(snapshot.data().count);
      } catch (err) {
        console.error("Error fetching total count:", err);
      }
    };
    fetchTotalCount();
  }, []);

  // Effect for the initial load of the first page
  useEffect(() => {
    setLoading(true);
    const testimoniesRef = collection(db, 'testimonies');
    const q = query(
      testimoniesRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTestimonies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setTestimonies(fetchedTestimonies);
      setHasMore(fetchedTestimonies.length === pageSize);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching initial testimonies:", err);
      setError("Failed to load testimonies.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (!lastVisible || !hasMore) return;

    setLoadingMore(true);
    setError(null);
    try {
      const testimoniesRef = collection(db, 'testimonies');
      const q = query(
        testimoniesRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(q);
      const newTestimonies = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setTestimonies(prev => [...prev, ...newTestimonies]);
      setHasMore(newTestimonies.length === pageSize);
    } catch (err) {
      console.error("Error fetching next page:", err);
      setError("Failed to load more testimonies.");
    } finally {
      setLoadingMore(false);
    }
  }, [lastVisible, hasMore]);

  const addTestimony = useCallback(async (formData, profilePictureFile) => {
    if (!currentUser) throw new Error("You must be logged in to submit a testimony.");

    let profilePictureUrl = currentUser.photoURL || '';

    if (profilePictureFile) {
      const filePath = `testimony-pictures/${currentUser.uid}/${Date.now()}_${profilePictureFile.name}`;
     
    }

    const testimoniesRef = collection(db, 'testimonies');
    await addDoc(testimoniesRef, {
      ...formData,
      userId: currentUser.uid,
      displayName: currentUser.displayName || currentUser.email,
      profilePictureUrl,
      createdAt: Timestamp.now(),
    });
  }, [currentUser]);

  return { testimonies, loading, loadingMore, error, hasMore, totalCount, fetchNextPage, addTestimony };
};
