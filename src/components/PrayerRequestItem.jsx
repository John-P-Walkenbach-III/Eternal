import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot, runTransaction, increment } from 'firebase/firestore';
import { FaHeart } from 'react-icons/fa';

const PrayerRequestItem = ({ request }) => {
  const { currentUser } = useAuth();
  const [prayCount, setPrayCount] = useState(request.prayCount || 0);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestDocRef = doc(db, 'prayerRequests', request.id);

  // Effect to check if the current user has already prayed for this request
  useEffect(() => {
    if (!currentUser) return;
    const prayerDocRef = doc(requestDocRef, 'prayers', currentUser.uid);
    const unsubscribe = onSnapshot(prayerDocRef, (doc) => {
      setHasPrayed(doc.exists());
    });
    return () => unsubscribe();
  }, [currentUser, requestDocRef]);

  // Effect to listen for real-time updates to the prayer count
  useEffect(() => {
    const unsubscribe = onSnapshot(requestDocRef, (doc) => {
      if (doc.exists()) {
        setPrayCount(doc.data().prayCount || 0);
      }
    });
    return () => unsubscribe();
  }, [requestDocRef]);

  const handlePray = async () => {
    if (!currentUser || isProcessing) return;
    setIsProcessing(true);

    const prayerDocRef = doc(requestDocRef, 'prayers', currentUser.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const prayerDoc = await transaction.get(prayerDocRef);
        if (prayerDoc.exists()) {
          // User is removing their prayer (toggling off)
          transaction.update(requestDocRef, { prayCount: increment(-1) });
          transaction.delete(prayerDocRef);
        } else {
          transaction.update(requestDocRef, { prayCount: increment(1) });
          transaction.set(prayerDocRef, { prayedAt: new Date() });
        }
      });
    } catch (error) {
      console.error("Prayer transaction failed: ", error);
      alert("Could not process your prayer. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="prayer-request-card">
      <p className="prayer-request-text">"{request.requestText}"</p>
      <cite className="prayer-request-author">- {request.displayName || 'Anonymous'}</cite>
      <div className="prayer-actions">
        <button onClick={handlePray} disabled={isProcessing} className={`pray-button ${hasPrayed ? 'active' : ''}`}>
          <FaHeart /> {hasPrayed ? "Liked" : "Like"} ({prayCount})
        </button>
      </div>
    </div>
  );
};

export default PrayerRequestItem;