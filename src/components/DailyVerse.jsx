import React, { useState, useEffect } from "react"
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot, runTransaction, increment } from 'firebase/firestore';
import { FaSave, FaHeart, FaShare, FaCrown } from 'react-icons/fa';

function DailyVerse() {
  const { currentUser } = useAuth();
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the "Save to Journal" button
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

    // State for the "Share" button
  const [copySuccess, setCopySuccess] = useState('');


  // State for the "Like" button
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);


    const handleShare = async () => {
    if (!verse) return;

    const shareText = `"${verse.text}" - ${verse.reference}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verse of the Day',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Reset after 2 seconds
      });
    }
  };



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
    const verseDocRef = doc(db, 'devotionals', verseId);
 
    // Subscribe to changes in the verse document (for likeCount)
    const unsubscribeVerse = onSnapshot(verseDocRef, (doc) => {
      if (doc.exists()) {
        setLikes(doc.data().likeCount || 0);
      } else {
        setLikes(0);
      }
    });
 
    // Check if the current user has liked this verse
    let unsubscribeUserLike;
    if (currentUser) {
      const userLikeDocRef = doc(verseDocRef, 'likes', currentUser.uid);
      unsubscribeUserLike = onSnapshot(userLikeDocRef, (doc) => {
        setIsLiked(doc.exists());
      });
    }
 
    // Cleanup subscriptions on unmount
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
    const verseDocRef = doc(db, 'devotionals', verseId);
    const likeDocRef = doc(verseDocRef, 'likes', currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const likeDoc = await transaction.get(likeDocRef);

        if (likeDoc.exists()) {
          // The user is unliking the verse
          transaction.update(verseDocRef, { likeCount: increment(-1) });
          transaction.delete(likeDocRef); // User is unliking
        } else {
          // The user is liking the verse
          const verseDoc = await transaction.get(verseDocRef);
          if (!verseDoc.exists()) {
            // If the verse document doesn't exist, create it with the initial data.
            transaction.set(verseDocRef, {
              reference: verse.reference,
              text: verse.text,
              likeCount: 1
            });
          } else {
            // Otherwise, just increment the like count.
            transaction.update(verseDocRef, { likeCount: increment(1) });
          }
          transaction.set(likeDocRef, { likedAt: serverTimestamp() }); // User is liking
        }
      });
    } catch (error) {
      console.error("Like transaction failed: ", error);
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
          <div className="left-actions">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`like-button ${isLiked ? 'liked' : ''}`}
            >
              <FaHeart /> {likes}
            </button>
          </div>
          <div className="right-actions">
            <button onClick={handleShare} className="share-button">
              {copySuccess ? copySuccess : (
                <><FaShare /> Share</>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default DailyVerse
