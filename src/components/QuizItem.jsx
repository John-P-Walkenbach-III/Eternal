import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// Import the firestore database instance from your firebase config file
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './QuizItem.css'
import { Link } from 'react-router-dom';




const QuizItem = ({ quiz }) => {
  const { currentUser } = useAuth();
  const [score, setScore] = useState('');
  const [savedScore, setSavedScore] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create a unique ID for this quiz for this specific user in Firestore
  const quizDocId = currentUser ? `quiz_${currentUser.uid}_${quiz.title.replace(/\s+/g, '_')}` : null;

  useEffect(() => {
    const fetchScore = async () => {
      try {
        if (!quizDocId) {
          // No user or quiz title, so nothing to fetch.
          setIsLoading(false);
          return;
        }
        const quizDocRef = doc(db, 'quizScores', quizDocId);
        const docSnap = await getDoc(quizDocRef);
        if (docSnap.exists()) {
          setSavedScore(docSnap.data().score);
          setIsCompleted(true);
        }
      } catch (error) {
        console.error("Error fetching quiz score:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScore();
  }, [quizDocId]);

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      return alert('You must be logged in to save your score.');
    }

    const numericScore = parseInt(score, 10);
    if (!isNaN(numericScore) && numericScore >= 0 && numericScore <= 100) {
      const quizDocRef = doc(db, 'quizScores', quizDocId);
      await setDoc(quizDocRef, { score: numericScore, userId: currentUser.uid, quizTitle: quiz.title, completedAt: new Date() });
      setSavedScore(numericScore);
      setIsCompleted(true);
    } else {
      alert('Please enter a valid score between 0 and 100.');
    }
  };

  if (isLoading) {
    return <li className="quiz-item loading"><span>Loading...</span></li>;
  }

  return (
    <li className={`quiz-item ${isCompleted ? 'completed' : ''}`}>
      <div className="quiz-info">
        <a href={quiz.url} target="_blank" rel="noopener noreferrer" className="quiz-link">
          {quiz.title}
        </a>
             {quiz.passage && (
          <Link to={`/bible-reader/${encodeURIComponent(quiz.passage)}`} className="study-link">
            Study Passage
          </Link>
        )}
        {isCompleted && (
          <span className="quiz-status">
            ✓ Completed | Score: {savedScore}%
          </span>
        )}
      </div>
      {!isCompleted && (
        <form className="score-form" onSubmit={handleSaveScore}>
          <input type="number" min="0" max="100" placeholder="Enter score %" value={score} onChange={(e) => setScore(e.target.value)} className="score-input" />
          <button type="submit" className="save-button">Save Score</button>
        </form>
      )}
    </li>
  );
};

export default QuizItem;