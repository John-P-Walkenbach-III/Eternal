import React, { useState, useEffect } from 'react';
import './VerseScramble.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size'
import { useGameScore } from '../hooks/useGameScore';

const VerseScramble = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [scrambledWords, setScrambledWords] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [width, height] = useWindowSize()
  const [justAddedIndex, setJustAddedIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { highScore, updateHighScore } = useGameScore();

  // Mock puzzle data. You can easily expand this list.
  const puzzles = [
    {
      // The 'correct' verse is used for validation.
      correct: "For God so loved the world that He gave His only Son",
      category: "Love",
    },
    {
      correct: "The Lord is my shepherd I shall not want",
      category: "Faith",
    },
    {
      correct: "I can do all things through Christ who strengthens me",
      category: "Strength",
    },
    {
        correct: "Trust in the Lord with all your heart, and do not lean on your own understanding",
        category: "Encouragement"
    },
    {
        correct: "Be still, and know that I am God",
        category: "Foundational"

    },
    {
        correct: "Come to me, all who labor and are heavy laden, and I will give you rest",
        category: "Encouragement"
    },
    {
        correct: "Fear not, for I am with you",
        category: "Faith"
    },
    {
        correct: "Do to others as you would have them do to you",
        category: "Faith"
    },
    {
        correct: "You are the light of the world",
        category: "Foundational"
    },
    { correct: ""},
  ];

  const loadNextPuzzle = () => {
    // Filter out any invalid puzzles (like empty strings) before selecting one
    const validPuzzles = puzzles.filter(p => p.correct && p.correct.trim() !== "");
    if (validPuzzles.length === 0) {
      console.error("No valid puzzles available.");
      return; // Stop if no puzzles are left to display
    }
    const randomIndex = Math.floor(Math.random() * validPuzzles.length);
    const puzzle = validPuzzles[randomIndex];
    setCurrentPuzzle(puzzle);

    const words = puzzle.correct.split(" ");
    // Create a truly shuffled array of the words for the user to pick from
    setScrambledWords([...words].sort(() => Math.random() - 0.5));
    setUserAnswer([]);
    setFeedback({ message: '', type: '' });
    setTimeLeft(60); // Reset timer to 60 seconds
    setTimerActive(true); // Start the timer for the new puzzle
    setShowConfetti(false); // Make sure confetti is off for the new puzzle
    setJustAddedIndex(null); // Reset animation state on new puzzle
  };

  // Load the first puzzle when the component mounts
  useEffect(() => {
    loadNextPuzzle();
  }, []);

  // Timer logic
  useEffect(() => {
    // Don't run if timer is inactive, puzzle is solved, or time is up
    if (!timerActive || feedback.type === 'success' || timeLeft <= 0) {
      if (timeLeft <= 0 && feedback.type !== 'success') {
        setFeedback({ message: "Time's up! Try the next puzzle.", type: 'error' });
        setTimerActive(false);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on re-render
  }, [timerActive, timeLeft, feedback.type]);

  const handleWordSelect = (word, index) => {
    const newAnswer = [...userAnswer, word];
    // Add word to user's answer
    setUserAnswer(newAnswer);

    // Set the index of the new word for animation
    setJustAddedIndex(newAnswer.length - 1);
    // Remove the animation class after it has played so it can be re-triggered
    setTimeout(() => setJustAddedIndex(null), 300); // Duration should match CSS animation

    // Remove word from the available choices
    const newScrambled = [...scrambledWords];
    newScrambled.splice(index, 1);
    setScrambledWords(newScrambled);
  };

  const handleWordDeselect = (word, index) => {
    // Add word back to the available choices
    setScrambledWords([...scrambledWords, word]);
    // Remove word from user's answer
    const newAnswer = [...userAnswer];
    newAnswer.splice(index, 1);
    setUserAnswer(newAnswer);
  };

  const checkAnswer = () => {
    if (userAnswer.join(' ') === currentPuzzle.correct) {
      setTimerActive(false); // Stop the timer on success
      const score = timeLeft * 50; // Calculate score
      let feedbackMessage = `Correct! Your score: ${score}`;
      if (score > highScore) {
        feedbackMessage += " (New High Score!)";
        updateHighScore(score);
      }
      setFeedback({ message: feedbackMessage, type: 'success' });
      setShowConfetti(true); // Trigger the confetti!
      // Optional: Stop the confetti after a few seconds
      setTimeout(() => setShowConfetti(false), 8000); // 8 seconds of celebration
    } else {
      setFeedback({ message: 'Not quite, try again!', type: 'error' });
    }
  };

  return (
    <div className="verse-scramble-container">
      {/* Confetti will now render within this container */}
      {showConfetti && <Confetti width={width} height={height}  />}
      {/* Render confetti when showConfetti is true */}
      {currentPuzzle && (
        <>
          <div className="game-header">
            <div>
              <h3>Unscramble the Verse</h3>
              <p className="puzzle-category">Category: {currentPuzzle.category}</p>
            </div>
            <div className={`timer ${timeLeft <= 10 ? 'low-time' : ''}`}>Time Left: {timeLeft}s</div>
          </div>
          
          <div className="answer-area">
            {userAnswer.length > 0
              ? userAnswer.map((word, index) => (
                  <button
                    key={`${word}-${index}`}
                    onClick={() => handleWordDeselect(word, index)}
                    className={`word-button answer ${index === justAddedIndex ? 'animate-pop-in' : ''}`}
                  >
                    {word}
                  </button>
                ))
              : <div className="placeholder-text">Click words below to build the verse here.</div>
            }
          </div>

          <div className="word-bank">
            {scrambledWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordSelect(word, index)}
                className="word-button"
                disabled={feedback.type === 'success' || timeLeft === 0}
              >
                {word}
              </button>
            ))}
          </div>

          {feedback.message && <div className={`feedback ${feedback.type}`}>{feedback.message}</div>}
          
          {feedback.type === 'success' || timeLeft === 0 ? (
            <button onClick={loadNextPuzzle} className="action-button">Next Puzzle</button>
          ) : (
            <button onClick={checkAnswer} className="action-button" disabled={userAnswer.length === 0}>Check Answer</button>
          )}
        </>
      )}
    </div>
  );
};

export default VerseScramble;