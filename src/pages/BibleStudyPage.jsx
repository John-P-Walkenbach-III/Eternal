import React, { useState } from 'react';
import { bibleStudyTopics } from '../data/bibleStudyTopics.jsx';
import './BibleStudyPage.css';
import QuizItem from '../components/QuizItem.jsx';

const BibleStudyPage = () => {
  const [expandedBook, setExpandedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleBook = (bookName) => {
    setExpandedBook(prevExpanded => (prevExpanded === bookName ? null : bookName));
  };

  const filteredTopics = bibleStudyTopics.map(topic => {
    const filteredBooks = topic.books.filter(book => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const bookNameMatches = book.name.toLowerCase().includes(lowerCaseSearchTerm);
      const quizTitleMatches = book.quizzes.some(quiz => 
        quiz.title.toLowerCase().includes(lowerCaseSearchTerm)
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
                  {book.quizzes.map((quiz) => <QuizItem key={quiz.title} quiz={quiz} />)}
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