import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot, runTransaction, increment } from 'firebase/firestore';
import { FaHandsHelping, FaShare } from 'react-icons/fa';
import CollapsibleText from './CollapsibleText.jsx';

const TestimonyItem = ({ testimony }) => {
  const { currentUser } = useAuth();
  const [amenCount, setAmenCount] = useState(testimony.likeCount || 0);
  const [isAmen, setIsAmen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const testimonyDocRef = doc(db, 'testimonies', testimony.id);

  // Effect to check if the current user has already said "Amen"
  useEffect(() => {
    if (!currentUser) return;
    const amenDocRef = doc(testimonyDocRef, 'likes', currentUser.uid);
    const unsubscribe = onSnapshot(amenDocRef, (doc) => {
      setIsAmen(doc.exists());
    });
    return () => unsubscribe();
  }, [currentUser, testimonyDocRef]);

  // Effect to listen for real-time updates to the amen count
  useEffect(() => {
    const unsubscribe = onSnapshot(testimonyDocRef, (doc) => {
      if (doc.exists()) {
        setAmenCount(doc.data().likeCount || 0);
      }
    });
    return () => unsubscribe();
  }, [testimonyDocRef]);

  const handleAmen = async () => {
    if (!currentUser || isProcessing) return;
    setIsProcessing(true);

    const amenDocRef = doc(testimonyDocRef, 'likes', currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const amenDoc = await transaction.get(amenDocRef);
        if (amenDoc.exists()) {
          // User is removing their "Amen"
          transaction.update(testimonyDocRef, { likeCount: increment(-1) });
          transaction.delete(amenDocRef);
        } else {
          // User is adding an "Amen"
          transaction.update(testimonyDocRef, { likeCount: increment(1) });
          transaction.set(amenDocRef, { likedAt: new Date() });
        }
      });
    } catch (error) {
      console.error("Amen transaction failed: ", error);
      alert("Could not process your 'Amen'. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!testimony) return;

    const shareText = `"${testimony.story}" - ${testimony.displayName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'An Inspiring Testimony from Eternal Life Ministry',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing testimony:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      });
    }
  };

  return (
    <div className="testimony-card">
      <div className="testimony-card-header">
        <span className="author">- {testimony.displayName}</span>
      </div>
      <CollapsibleText text={testimony.story} limit={350} />
      <div className="testimony-details">
        <span className="details">Saved at age {testimony.ageSaved} | Baptized: {testimony.isBaptized ? 'Yes' : 'No'}</span>
      </div>
      {currentUser && (
        <div className="testimony-actions">
          <button onClick={handleAmen} disabled={isProcessing} className={`amen-button ${isAmen ? 'active' : ''}`}>
            <FaHandsHelping /> {amenCount} Amen{amenCount !== 1 ? 's' : ''}
          </button>
          <button onClick={handleShare} className="share-button">
            {copySuccess ? copySuccess : (
              <><FaShare /> Share</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonyItem;