import React from 'react';
import VerseScramble from '../components/VerseScramble';
import { useGameScore } from '../hooks/useGameScore';
import { FaTrophy } from 'react-icons/fa';

const GamePage = () => {
  const { highScore, loading, error } = useGameScore();

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2rem 1rem 0' }}>
        <h1>Verse Scramble Game</h1>
        <div className="high-score-display" style={{ margin: '1rem 0', fontSize: '1.2rem', color: '#444' }}>
          <FaTrophy style={{ color: '#ffc107', marginRight: '8px' }} /> 
          Your High Score: {loading ? '...' : highScore}
        </div>
        {error && (
          <div className="game-error" style={{ color: '#c62828', fontWeight: 'bold', marginTop: '1rem' }}>
            {error}
          </div>
        )}
        <p>Put the words in the correct order to form a well-known Bible verse!</p>
      </div>
      <VerseScramble />
    </div>
  );
};

export default GamePage;