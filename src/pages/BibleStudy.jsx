import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseLessons } from '../data/nt-course-data.js';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LESSONS_PER_PAGE = 10;

function BibleStudy() {
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [inputScores, setInputScores] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Effect to fetch user progress from Firestore
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!currentUser) {
        setLoadingProgress(false);
        return;
      }
      setLoadingProgress(true);
      try {
        const progressDocRef = doc(db, 'user_progress', currentUser.uid);
        const docSnap = await getDoc(progressDocRef);
        if (docSnap.exists()) {
          setUserProgress(docSnap.data());
        } else {
          // No progress document yet, so we can set it to an empty object
          setUserProgress({});
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchUserProgress();
  }, [currentUser]); // Re-run when the user logs in/out

  // Pagination logic
  const totalPages = Math.ceil(courseLessons.length / LESSONS_PER_PAGE);
  const startIndex = (currentPage - 1) * LESSONS_PER_PAGE;
  const endIndex = startIndex + LESSONS_PER_PAGE;
  const currentLessons = courseLessons.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleScoreChange = (lessonId, score) => {
    setInputScores((prev) => ({
      ...prev,
      [lessonId]: score,
    }));
  };

  const handleSaveScore = async (lessonId) => {
    if (!currentUser) {
      alert('You must be logged in to save your score.');
      return;
    }

    const score = parseInt(inputScores[lessonId], 10);
    if (isNaN(score) || score < 0 || score > 100) {
      alert('Please enter a valid score between 0 and 100.');
      return;
    }

    const progressDocRef = doc(db, 'user_progress', currentUser.uid);
    try {
      await setDoc(
        progressDocRef,
        { [lessonId]: { completed: true, score: score } },
        { merge: true }
      );

      // Optimistically update local state for immediate feedback
      setUserProgress((prev) => ({ ...prev, [lessonId]: { completed: true, score: score } }));
      setInputScores((prev) => ({ ...prev, [lessonId]: '' })); // Clear input
    } catch (error) {
      console.error('Error saving score: ', error);
      alert('Failed to save score. Please try again.');
    }
  };

  // Calculate progress stats
  const completedLessonsCount = userProgress ? Object.values(userProgress).filter(p => p.completed).length : 0;
  const totalLessons = courseLessons.length;
  const totalScore = userProgress ? Object.values(userProgress).reduce((acc, p) => acc + (p.score || 0), 0) : 0;
  const overallScore = completedLessonsCount > 0 ? (totalScore / completedLessonsCount).toFixed(0) : 0;

  if (loadingProgress) {
    return <div className="bible-study-page"><p>Loading your progress...</p></div>;
  }

  return (
    <div className="bible-study-page">
      <h2>New Testament Study Course</h2>
      <p>
        Welcome to the course! Work your way through the chapters of the New Testament. Read the chapter, then take the quiz to test your knowledge.
      </p>

      <div className="course-progress-overview">
        <h3>Your Progress</h3>
        <p>Completed: {completedLessonsCount} of {totalLessons} lessons</p>
        <p>Overall Score: {overallScore}%</p>
      </div>

      <div className="lesson-list">
        {currentLessons.map((lesson) => {
          const progress = userProgress ? userProgress[lesson.id] : null;
          const isCompleted = progress && progress.completed;
          return (
            <div key={lesson.id} className={`lesson-card ${isCompleted ? 'completed' : ''}`}>
              <div className="lesson-info">
                <h4>{lesson.title}</h4>
                {isCompleted && <span className="completion-badge">✓ Score: {progress.score}%</span>}
              </div>
              <div className="lesson-actions">
                <Link to="/features" className="feature-link">Read Chapter</Link>
                <a href={lesson.quizUrl} className="cta-button" target="_blank" rel="noopener noreferrer">
                  {isCompleted ? 'Retake Quiz' : 'Take Quiz'}
                </a>
              </div>
              <div className="score-entry">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Score %"
                  value={inputScores[lesson.id] || ''}
                  onChange={(e) => handleScoreChange(lesson.id, e.target.value)}
                />
                <button onClick={() => handleSaveScore(lesson.id)}>Save</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default BibleStudy;