import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './GamePage.css';

function GamePage() {
  const { currentUser } = useAuth();
  const [originalWords, setOriginalWords] = useState([]);
  const [scrambledWords, setScrambledWords] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [verseText, setVerseText] = useState('');
  const [verseReference, setVerseReference] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    setupGame();
  }, []);

  const setupGame = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Starting to fetch verse...");
      // This is a free API, no key required.
      const response = await fetch(
        "https://beta.ourmanna.com/api/v1/get?format=json&order=random"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch a new verse.");
      }
      console.log("Verse fetch successful. Processing data...");

      const data = await response.json();
      const verse = data.verse.details;

      console.log("Verse data:", verse);


      setVerseText(verse.text);
      setVerseReference(verse.reference);
      const words = verse.text.split(' ');
      setOriginalWords(words);
      setScrambledWords([...words].sort(() => Math.random() - 0.5));
      setAnswer([]);
    } catch (err) {
      console.error("Error during setup:", err);
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
    setIsCorrect(false);
    setShowConfetti(false);
  };

  const handleWordClick = (word, index) => {
    // Add word to answer and remove from scrambled list
    setAnswer([...answer, word]);
    setScrambledWords(scrambledWords.filter((_, i) => i !== index));
  };

  const handleAnswerClick = (word, index) => {
    // Remove word from answer and add back to scrambled list
    setAnswer(answer.filter((_, i) => i !== index));
    setScrambledWords([...scrambledWords, word]);
  };

  useEffect(() => {
    // Check for win condition
    if (originalWords.length > 0 && answer.length === originalWords.length) {
      if (answer.join(' ') === originalWords.join(' ')) {
        setIsCorrect(true);
      }
    }
  }, [answer, originalWords]);

  const saveScore = async () => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'leaderboard'), {
        userId: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        score: 500, // Example score
        createdAt: serverTimestamp(),
      });
      alert('Score saved! Check the leaderboard.');
    } catch (error) {
      console.error("Error saving score: ", error);
    } finally {
      setShowConfetti(true);
    }
  };

  if (loading) return <p>Loading verse.  Please wait...</p>;
  if (error) return (
    <p className="status-message error">
      Could not load verse. Please check your network connection and try
      again later.
      <button onClick={setupGame}>Retry</button>
    </p>
  );
  if (!verseText || !verseReference) return <p>Loading verse...</p>;

  return (
    <div className="game-page">
      {showConfetti && <Confetti width={width} height={height} />}
      <h1>Verse Scramble</h1>
      <p className="instructions">Click the words in the correct order to unscramble the verse!</p>
      
      <div className="verse-reference">{verseReference}</div>

      <div className="game-board">
        <div className="answer-area">
          {answer.map((word, index) => (
            <button key={index} onClick={() => handleAnswerClick(word, index)} className="word-button answer">
              {word}
            </button>
          ))}
        </div>

        <hr />

        <div className="scrambled-area">
          {scrambledWords.map((word, index) => (
            <button key={index} onClick={() => handleWordClick(word, index)} className="word-button">
              {word}
            </button>
          ))}
        </div>
      </div>

      {isCorrect && (
        <div className="win-message">
          <h2>Congratulations!</h2>
          <p>You unscrambled the verse correctly!</p>
          <div className="win-actions" >
            <button onClick={setupGame} className="game-button">Play Again</button>
            <button onClick={saveScore} className="game-button primary">Save High Score</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;