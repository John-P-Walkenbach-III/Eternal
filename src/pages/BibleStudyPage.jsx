import React, { useState, useEffect } from 'react';
import { bibleStudyTopics } from '../data/bibleStudyTopics.jsx';
import './BibleStudyPage.css';
import QuizItem from '../components/QuizItem.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const BibleStudyPage = () => {
  const { currentUser } = useAuth();
  const [expandedBook, setExpandedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const handleToggleBook = (bookName) => {
    setExpandedBook(prevExpanded => (prevExpanded === bookName ? null : bookName));
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) {
        setIsLoadingProgress(false);
        return;
      }
      try {
        const scoresCollectionRef = collection(db, 'quizScores');
        // We only need the count, so this query is efficient.
        const q = query(scoresCollectionRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        setCompletedCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching progress for Bible Study page:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };
    fetchProgress();
  }, [currentUser]);

  // --- Pre-process topics to add quiz numbers and unique IDs ---
  let globalQuizCounter = 0;
  const processedTopics = bibleStudyTopics.map(topic => ({
    ...topic,
    books: topic.books.map(book => ({
      ...book,
      quizzes: book.quizzes.map(quiz => {
        globalQuizCounter++;
        const fullTitle = `Quiz ${globalQuizCounter}: ${book.name} ${quiz.title}`;
        // This creates a stable, unique ID like "Matthew_Chapter_1"
        const uniqueId = `${book.name.replace(/\s+/g, '_')}_${quiz.title.replace(/\s+/g, '_')}`;
        return {
          ...quiz,
          fullTitle: fullTitle,
          id: uniqueId,
        };
      })
    }))
  }));

  const totalQuizzes = processedTopics.reduce((total, topic) => {
    return total + topic.books.reduce((bookTotal, book) => bookTotal + book.quizzes.length, 0);
  }, 0);

  const filteredTopics = processedTopics
    .map(topic => {
    const filteredBooks = topic.books.filter(book => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const bookNameMatches = book.name.toLowerCase().includes(lowerCaseSearchTerm);
      const quizTitleMatches = book.quizzes.some(quiz => 
        quiz.fullTitle.toLowerCase().includes(lowerCaseSearchTerm)
      );
      return bookNameMatches || quizTitleMatches;
    });
    return { ...topic, books: filteredBooks };
  }).filter(topic => topic.books.length > 0);

  return (
    <div className="bible-study-container">
      <h1>Bible Study Courses</h1>
      <h1>The Tests Are Currently in development. Please Be Patient</h1>
      <p>Select a topic below to begin your study and take a quiz.</p>

      <div className="quiz-instructions">
        <h3>How to Track Your Progress</h3>
        <ol>
          <li>Click on a quiz link below. The quiz will open in a new browser tab.</li>
          <li>Complete the quiz in Microsoft Forms.</li>
          <li>After submitting, you will see your score (e.g., 80%) at the top of the form.</li>
          <li>Return to this page and enter the number part of your score (e.g., 80) into the box("Enter Score %") next to the quiz you just took.</li>
          <li>Click the "Save Score" button to add it to your progress tracker!</li>
        </ol>
      </div>

      {currentUser && !isLoadingProgress && (
        <div className="progress-tracker">
          <h3>Your Progress</h3>
          <p>You have completed {completedCount} of {totalQuizzes} quizzes.</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${totalQuizzes > 0 ? (completedCount / totalQuizzes) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      )}


      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a book or quiz..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTopics.map((topic) => (
        <div key={topic.category} className="study-category">
          <h2>{topic.category}</h2>
          {topic.books.map((book) => (
            <div key={book.name} className={`study-book ${expandedBook === book.name ? 'expanded' : ''}`}>
              <h3 onClick={() => handleToggleBook(book.name)}>
                {book.name}
              </h3>
              {expandedBook === book.name && (
                <ul>
                  {book.quizzes.map((quiz) => <QuizItem key={quiz.id} quiz={quiz} />)}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
      {filteredTopics.length === 0 && searchTerm && (
        <p>No results found for "{searchTerm}".</p>
      )}
    </div>
  );
}

export default BibleStudyPage;