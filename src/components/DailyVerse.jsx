import React, { useState, useEffect } from "react"
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot, query, setDoc, deleteDoc } from 'firebase/firestore';
import { FaSave, FaHeart } from 'react-icons/fa';

function DailyVerse() {
  const { currentUser } = useAuth();
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the "Save to Journal" button
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State for the "Like" button
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        // We add a timestamp to prevent the browser from caching the result
        const response = await fetch(`https://bible-api.com/?random=verse&_=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the verse of the day.");
        }
        const data = await response.json();
        setVerse({ text: data.text.trim(), reference: data.reference });
      } catch (err) {
        setError(err.message)
        console.error(err)
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to listen for like changes in real-time
  useEffect(() => {
    if (!verse) return;

    const verseId = verse.reference.replace(/\s|:/g, '_'); // Sanitize for Firestore doc ID
    const likesCollectionRef = collection(db, 'devotionals', verseId, 'likes');

    // Subscribe to changes in the number of likes
    const unsubscribeLikes = onSnapshot(query(likesCollectionRef), (snapshot) => {
      setLikes(snapshot.size);
    });

    // Check if the current user has liked this verse
    let unsubscribeUserLike;
    if (currentUser) {
      const userLikeDocRef = doc(likesCollectionRef, currentUser.uid);
      unsubscribeUserLike = onSnapshot(userLikeDocRef, (doc) => {
        setIsLiked(doc.exists());
      });
    }

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeLikes();
      if (unsubscribeUserLike) unsubscribeUserLike();
    };
  }, [verse, currentUser]);

  const handleSaveToJournal = async () => {
    if (!currentUser || !verse || isSaving) return;
    setIsSaving(true);
    try {
      const journalCollectionRef = collection(db, 'users', currentUser.uid, 'journalEntries');
      await addDoc(journalCollectionRef, {
        title: `Verse: ${verse.reference}`,
        content: `"${verse.text}"`,
        createdAt: serverTimestamp(),
        category: 'Verse' // Add a category for easy filtering
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Reset button text after 3 seconds
    } catch (error) {
      console.error("Error saving verse to journal:", error);
      alert("Could not save verse. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !verse || isLiking) return;
    setIsLiking(true);

    const verseId = verse.reference.replace(/\s|:/g, '_');
    const likeDocRef = doc(db, 'devotionals', verseId, 'likes', currentUser.uid);

    try {
      if (isLiked) {
        await deleteDoc(likeDocRef); // User is unliking
      } else {
        await setDoc(likeDocRef, { likedAt: serverTimestamp() }); // User is liking
      }
    } catch (error) {
      console.error("Error liking verse:", error);
      alert("Could not update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  if (loading)
    return (
      <div className="daily-verse-container">
        <p>Loading inspirational verse...</p>
      </div>
    )
  if (error)
    return (
      <div className="daily-verse-container">
        <p className="status-message error">
          Could not load verse. Please try again later.
        </p>
      </div>
    )

  return (
    <section className="daily-verse-container">
      <div className="verse-header">
        <h3>Verse of the Day</h3>
        {currentUser && verse && (
          <button
            onClick={handleSaveToJournal}
            disabled={isSaving || saveSuccess}
            className="save-verse-button"
          >
            <FaSave /> {saveSuccess ? 'Saved!' : 'Save to Journal'}
          </button>
        )}
      </div>
      <blockquote className="verse-text">"{verse.text}"</blockquote>
      <cite className="verse-reference">{verse.reference}</cite>
      {currentUser && (
        <div className="verse-actions">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`like-button ${isLiked ? 'liked' : ''}`}
          >
            <FaHeart /> {likes}
          </button>
        </div>
      )}
    </section>
  )
}

export default DailyVerse
