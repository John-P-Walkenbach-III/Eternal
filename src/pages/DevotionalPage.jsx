import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit, orderBy, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import DailyVerse from '../components/DailyVerse.jsx';
import CommentSection from '../components/CommentSection.jsx';
import { FaHeart } from 'react-icons/fa';
import './DevotionalPage.css';

function DevotionalPage() {
  const { currentUser } = useAuth();
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchDevotional = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        const devotionalsRef = collection(db, 'devotionals');
        const q = query(devotionalsRef, where('date', '==', today), limit(1));
        const querySnapshot = await getDocs(q);

        let devotionalDoc;
        if (querySnapshot.empty) {
          // If no devotional for today, find the most recent featured one
          console.log("No devotional for today, looking for a featured one...");
          const featuredQuery = query(
            devotionalsRef,
            where('featured', '==', true),
            orderBy('date', 'desc'),
            limit(1)
          );
          const featuredSnapshot = await getDocs(featuredQuery);
          if (featuredSnapshot.empty) {
            setError('No devotional is available for today. An admin can add one or mark a past entry as "featured".');
            return;
          }
          devotionalDoc = featuredSnapshot.docs[0];
        } else {
          devotionalDoc = querySnapshot.docs[0];
        }

        const devotionalData = { id: devotionalDoc.id, ...devotionalDoc.data() };
        setDevotional(devotionalData);

        // Check if the current user has already liked this devotional
        if (currentUser) {
          const likeDocRef = doc(db, 'users', currentUser.uid, 'likes', devotionalData.id);
          const likeDoc = await getDoc(likeDocRef);
          if (likeDoc.exists()) {
            setIsLiked(true);
          }
        }
      } catch (err) {
        console.error("Error fetching devotional:", err);
        setError('Failed to load the devotional.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevotional();
  }, []);

  const handleLike = async () => {
    if (!currentUser || !devotional || isLiked) return;

    const devotionalRef = doc(db, 'devotionals', devotional.id);
    const userLikeRef = doc(db, 'users', currentUser.uid, 'likes', devotional.id);

    try {
      await runTransaction(db, async (transaction) => {
        const devotionalDoc = await transaction.get(devotionalRef);
        if (!devotionalDoc.exists()) throw "Devotional does not exist!";

        const currentLikes = devotionalDoc.data().likeCount || 0;
        transaction.update(devotionalRef, { likeCount: currentLikes + 1 });
        transaction.set(userLikeRef, { likedAt: serverTimestamp() });
      });

      setIsLiked(true);
      setDevotional(prev => ({ ...prev, likeCount: (prev.likeCount || 0) + 1 }));
    } catch (e) {
      console.error("Like transaction failed: ", e);
    }
  };

  return (
    <div className="devotional-page">
      <div className="devotional-header">
        <h1>Daily Devotional</h1>
        <p>Take a moment to reflect on the Word and what it means for your life today.</p>
      </div>
      
      <DailyVerse />

      <hr className="section-divider" />

      <section className="devotional-content">
        {loading && <p>Loading today's reflection...</p>}
        {error && <p className="status-message error">{error}</p>}
        {devotional && (
          <>
            <h2>{devotional.title}</h2>
            <div className="reflection-text" style={{ whiteSpace: 'pre-wrap' }}>{devotional.content}</div>
            <div className="devotional-footer">
              <button onClick={handleLike} disabled={isLiked || !currentUser} className={`like-button ${isLiked ? 'liked' : ''}`}>
                <FaHeart />
                <span>{devotional.likeCount || 0}</span>
              </button>
            </div>
            <CommentSection collectionName="devotionals" docId={devotional.id} />
          </>
        )}
      </section>
    </div>
  );
}

export default DevotionalPage;