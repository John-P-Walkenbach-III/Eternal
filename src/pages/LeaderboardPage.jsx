import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { FaTrophy, FaSpinner } from 'react-icons/fa';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const { scores, loading, error } = useLeaderboard();

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <h1><FaTrophy /> Top Players</h1>
      <p className="leaderboard-description">See who has the highest scores in the Verse Scramble game!</p>
      
      <div className="leaderboard-container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>High Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id} className={index < 3 ? `top-${index + 1}` : ''}>
                <td>
                  {index === 0 && <FaTrophy className="rank-icon gold" />}
                  {index === 1 && <FaTrophy className="rank-icon silver" />}
                  {index === 2 && <FaTrophy className="rank-icon bronze" />}
                  {index + 1}
                </td>
                <td>{score.displayName || 'Anonymous'}</td>
                <td>{score.highScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {scores.length === 0 && <p className="no-scores">No scores recorded yet. Be the first to set a high score!</p>}
      </div>
    </div>
  );
};

export default LeaderboardPage;