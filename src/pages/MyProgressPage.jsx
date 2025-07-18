import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import './MyProgressPage.css';

const MyProgressPage = () => {
  const { currentUser } = useAuth();
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const scoresCollectionRef = collection(db, 'quizScores');
        const q = query(scoresCollectionRef, where("userId", "==", currentUser.uid), orderBy("completedAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const quizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setCompletedQuizzes(quizzes);
      } catch (err) {
        console.error("Error fetching user progress:", err);
        setError("Could not load your progress. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser]);

  if (isLoading) {
    return <div className="progress-container"><p>Loading your progress...</p></div>;
  }

  if (error) {
    return <div className="progress-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="progress-container">
      <h1>My Progress</h1>
      {completedQuizzes.length === 0 ? (
        <p>You haven't completed any quizzes yet. Head over to the Bible Study page to get started!</p>
      ) : (
        <ul className="progress-list">
          {completedQuizzes.map(quiz => (
            <li key={quiz.id} className="progress-item">
              <span className="progress-title">{quiz.quizTitle}</span>
              <span className="progress-score">Score: {quiz.score}%</span>
              <span className="progress-date">
                Completed on: {new Date(quiz.completedAt.toDate()).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProgressPage;