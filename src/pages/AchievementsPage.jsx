import React from 'react';
import { useAchievements } from '../hooks/useAchievements';
import { useNotification } from '../context/NotificationContext';
import './AchievementsPage.css';

const AchievementsPage = () => {
  const { achievements, unlockedAchievements, loading } = useAchievements();
  const { addNotification } = useNotification();

  const handleShare = async (achievement) => {
    const shareData = {
      title: `I unlocked an achievement on Eternal Life Ministry!`,
      text: `I just earned the "${achievement.title}" achievement: ${achievement.description}. Come join me on this journey!`,
      url: window.location.origin, // Shares the main site URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addNotification('Achievement shared successfully!');
      } catch (err) {
        // User might cancel the share, which is not an error.
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          addNotification('Could not share achievement.', 'error');
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      addNotification('Share text copied to clipboard!');
    }
  };
  
  if (loading) {
    return <div className="achievements-container"><p>Loading achievements...</p></div>;
  }

  return (
    <div className="achievements-container">
      <h1>Your Achievements</h1>
      <p className="subtitle">Celebrate your progress on your journey of faith.</p>
      <div className="achievements-grid">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.has(achievement.id);
          const cardClass = isUnlocked ? 'achievement-card unlocked' : 'achievement-card locked';

          return (
            <div key={achievement.id} className={cardClass}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-details">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </div>
              {isUnlocked && (
                <>
                  <div className="unlocked-badge">UNLOCKED</div>
                  <button className="share-button" onClick={() => handleShare(achievement)} title="Share this achievement">🔗 Share</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;
