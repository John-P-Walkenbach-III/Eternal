import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAchievements } from '../hooks/useAchievements';
import { bibleStudyTopics } from '../data/bibleStudyTopics';
import { getDisplayName } from '../utils/helpers';
import './DashboardPage.css';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [quizProgress, setQuizProgress] = useState({ completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const { achievements, unlockedAchievements } = useAchievements();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Fetch Quiz Progress
      const scoresCollectionRef = collection(db, 'quizScores');
      const q = query(scoresCollectionRef, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const completedCount = querySnapshot.size;

      const totalQuizzes = bibleStudyTopics.reduce((total, topic) => 
        total + topic.books.reduce((bookTotal, book) => bookTotal + book.quizzes.length, 0), 0);

      setQuizProgress({ completed: completedCount, total: totalQuizzes });
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <div className="dashboard-container"><p>Loading your dashboard...</p></div>;
  }

  const recentUnlocked = achievements
    .filter(ach => unlockedAchievements.has(ach.id))
    .slice(0, 4); // Show the first 4 unlocked achievements

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard, {getDisplayName(currentUser)}</h1>
        <p>This is your personal hub for tracking your journey of faith and learning.</p>
      </div>

      <div className="dashboard-grid">
          <div className="dashboard-card profile-settings">
          <h3>Your Profile</h3>
          <div className="profile-info">
            <p><strong>Display Name:</strong> {getDisplayName(currentUser)}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
          </div>
          <Link to="/profile" className="card-link">Edit Profile</Link>
        </div>
        <div className="dashboard-card progress-summary">
          <h3>Bible Study Progress</h3>
          <p>You have completed <strong>{quizProgress.completed}</strong> of <strong>{quizProgress.total}</strong> quizzes.</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${quizProgress.total > 0 ? (quizProgress.completed / quizProgress.total) * 100 : 0}%` }}
            ></div>
          </div>
          <Link to="/my-progress" className="card-link">View All Progress</Link>
        </div>

        <div className="dashboard-card recent-achievements">
          <h3>Recent Milestones</h3>
          <div className="achievements-preview">
            {recentUnlocked.length > 0 ? recentUnlocked.map(ach => (
              <div key={ach.id} className="achievement-item" title={`${ach.title}: ${ach.description}`}>
                <span className="achievement-icon">{ach.icon}</span>
                <span className="achievement-title">{ach.title}</span>
              </div>
            )) : <p>Start exploring the site to earn your first achievement!</p>}
          </div>
          <Link to="/achievements" className="card-link">View All Achievements</Link>
        </div>

        <div className="dashboard-card quick-links">
          <h3>Your Contributions</h3>
          <Link to="/journal" className="quick-link-button">My Prayer Journal</Link>
          <Link to="/testimonies" className="quick-link-button">Share a Testimony</Link>
          <Link to="/prayer-wall" className="quick-link-button">Visit the Prayer Wall</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;