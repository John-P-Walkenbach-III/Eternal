import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import './InteractiveStarRating.css';

const InteractiveStarRating = ({ resourceId, collectionName }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfRated = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      // Use a consistent ID format for the user's rating document
      const ratingDocRef = doc(db, 'users', currentUser.uid, 'ratings', `${collectionName}-${resourceId}`);
      const ratingDoc = await getDoc(ratingDocRef);
      if (ratingDoc.exists()) {
        setRating(ratingDoc.data().rating);
        setIsRated(true);
      }
      setLoading(false);
    };
    checkIfRated();
  }, [currentUser, resourceId, collectionName]);

  const handleRating = async (newRating) => {
    if (!currentUser || isRated) return;

    const resourceRef = doc(db, collectionName, resourceId);
    const userRatingRef = doc(db, 'users', currentUser.uid, 'ratings', `${collectionName}-${resourceId}`);

    try {
      await runTransaction(db, async (transaction) => {
        const resourceDoc = await transaction.get(resourceRef);
        if (!resourceDoc.exists()) throw "Resource does not exist!";

        const currentRating = resourceDoc.data().rating || 0;
        const ratingCount = resourceDoc.data().ratingCount || 0;

        transaction.update(resourceRef, {
          rating: currentRating + newRating,
          ratingCount: ratingCount + 1,
        });

        transaction.set(userRatingRef, { rating: newRating });
      });

      setRating(newRating);
      setIsRated(true);
    } catch (e) {
      console.error("Rating transaction failed: ", e);
    }
  };

  if (loading) return <div className="interactive-star-rating-placeholder" />;
  if (!currentUser) return <p className="rate-login-prompt">Please log in to rate.</p>;

  return (
    <div className="interactive-star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input type="radio" name={`rating-${resourceId}`} value={ratingValue} onClick={() => handleRating(ratingValue)} disabled={isRated} />
            <FaStar className="star" color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} onMouseEnter={() => !isRated && setHover(ratingValue)} onMouseLeave={() => !isRated && setHover(0)} />
          </label>
        );
      })}
      {isRated && <span className="thank-you-message">Thanks for rating!</span>}
    </div>
  );
};

export default InteractiveStarRating;