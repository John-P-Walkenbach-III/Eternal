import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseLessons } from '../data/nt-course-data.js';
import { db } from '../firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';
import { useUserProgress } from '../hooks/useUserProgress.js';

const LESSONS_PER_PAGE = 10;

function BibleStudy() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { loading, userProgress, setUserProgress, completedLessonsCount, totalLessons, overallScore } = useUserProgress();
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputScores, setInputScores] = useState({});

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

  if (loading) {
    return <div className="bible-study-page"><p>Loading your progress...</p></div>;
  }

  return (
    <div className="bible-study-page">
      <h2>New Testament Study Course</h2>
      <p>
        Welcome to the course! Work your way through the chapters of the New Testament. Read the chapter, then take the quiz to test your knowledge. Might I recommend using the "Bible Reader" provided by us that is found in the Features section or by clicking the "Read Chapter" button. Some of the wording may vary from different Bible versions. The quizzes provided here are taken from our Bible Reader.
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