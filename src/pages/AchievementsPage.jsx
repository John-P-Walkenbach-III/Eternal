import React from 'react';
import { useAchievements } from '../hooks/useAchievements';
import './AchievementsPage.css';

const AchievementsPage = () => {
  const { achievements, unlockedAchievements, loading } = useAchievements();

  if (loading) {
    return <div className="achievements-container"><p>Loading your achievements...</p></div>;
  }

  return (
    <div className="achievements-container">
      <h1>Your Milestones</h1>
      <p className="subtitle">Celebrate your journey of faith and learning. Here are the milestones you've reached.</p>
      <div className="achievements-grid">
        {achievements.map(ach => {
          const isUnlocked = unlockedAchievements.has(ach.id);
          return (
            <div key={ach.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">{ach.icon}</div>
              <div className="achievement-details">
                <h3>{ach.title}</h3>
                <p>{ach.description}</p>
              </div>
              {isUnlocked && <div className="unlocked-badge">Unlocked</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;