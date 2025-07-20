import React, { useState, useEffect } from "react"
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot, runTransaction, increment } from 'firebase/firestore';
import { FaSave, FaHeart, FaShare } from 'react-icons/fa';

function DailyVerse() {
  const { currentUser } = useAuth();
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the "Save to Journal" button
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State for the "Share" button
  const [copySuccess, setCopySuccess] = useState('');

  // State for the "Like" button
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchVerse = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      try {
        // We add a timestamp to prevent the browser from caching the result
        const response = await fetch(`https://bible-api.com/?random=verse&_=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the verse of the day from the external API.");
        }
        const data = await response.json();
        setVerse({ text: data.text.trim(), reference: data.reference });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching daily verse:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerse();
  }, []);

  // Effect to listen for like changes in real-time
  useEffect(() => {
    if (!verse) return;
 
    const verseId = verse.reference.replace(/\s|:/g, '_');
    const verseDocRef = doc(db, 'devotionals', verseId);
 
    const unsubscribeVerse = onSnapshot(verseDocRef, (doc) => {
      if (doc.exists()) {
        setLikes(doc.data().likeCount || 0);
      } else {
        setLikes(0);
      }
    });
 
    let unsubscribeUserLike;
    if (currentUser) {
      const userLikeDocRef = doc(verseDocRef, 'likes', currentUser.uid);
      unsubscribeUserLike = onSnapshot(userLikeDocRef, (doc) => {
        setIsLiked(doc.exists());
      });
    }
 
    return () => {
      unsubscribeVerse();
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
        category: 'Verse'
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving verse to journal:", error);
      alert("Could not save verse. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !verse || !verse.text || !verse.reference || isLiking) return;
    setIsLiking(true);

    const verseId = verse.reference.replace(/\s|:/g, '_');
    const verseDocRef = doc(db, 'devotionals', verseId);
    const likeDocRef = doc(verseDocRef, 'likes', currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const likeDoc = await transaction.get(likeDocRef);
        if (likeDoc.exists()) {
          transaction.update(verseDocRef, { likeCount: increment(-1) });
          transaction.delete(likeDocRef);
        } else {
          const verseDoc = await transaction.get(verseDocRef);
          if (!verseDoc.exists()) {
            transaction.set(verseDocRef, {
              reference: verse.reference,
              text: verse.text,
              likeCount: 1,
              createdAt: serverTimestamp()
            });
          } else {
            transaction.update(verseDocRef, { likeCount: increment(1) });
          }
          transaction.set(likeDocRef, { likedAt: serverTimestamp() });
        }
      });
    } catch (err) {
      console.error("Like transaction failed: ", err);
      alert("Could not update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (!verse) return;
    const shareText = `"${verse.text}" - ${verse.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Verse of the Day', text: shareText });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      });
    }
  };

  if (loading)
    return (
      <div className="daily-verse-container">
        <h3>Verse of the Day</h3>
        <p>Loading verse...</p>
      </div>
    );

  if (error)
    return (
      <div className="daily-verse-container">
        <h3>Verse of the Day</h3>
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <section className="daily-verse-container">
      <div className="verse-header">
        <h3>Verse of the Day</h3>
        {currentUser && verse && (
          <button onClick={handleSaveToJournal} disabled={isSaving || saveSuccess} className="save-verse-button">
            <FaSave /> {saveSuccess ? 'Saved!' : 'Save to Journal'}
          </button>
        )}
      </div>
      <blockquote className="verse-text">"{verse.text}"</blockquote>
      <cite className="verse-reference">{verse.reference}</cite>
      {currentUser && (
        <div className="verse-actions">
          <div className="left-actions">
            <button onClick={handleLike} disabled={isLiking} className={`like-button ${isLiked ? 'liked' : ''}`}>
              <FaHeart /> {likes}
            </button>
          </div>
          <div className="right-actions">
            <button onClick={handleShare} className="share-button">
              {copySuccess ? copySuccess : <><FaShare /> Share</>}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DailyVerse;
