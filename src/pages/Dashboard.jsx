import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '../hooks/useUserProgress';
import DailyVerse from '../components/DailyVerse.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import DashboardSkeleton from '../components/DashboardSkeleton'
import { FaBookOpen, FaChartLine, FaCheckCircle, FaCross } from 'react-icons/fa';
import './Dashboard.css';
import { getDisplayName } from '../utils/helpers.jsx';

function Dashboard() {
  const { loading, completedLessonsCount, totalLessons, overallScore, nextLesson, targetPage } =
    useUserProgress();
  const { currentUser } = useAuth();
  // Calculate progress percentage safely, preventing division by zero.
  const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;


  // While data is loading, display the skeleton UI
  if (loading) {
    return <DashboardSkeleton />;
  } 

  return (
    <div className="dashboard-page">  
      <h2>Welcome Back, {getDisplayName(currentUser)}!</h2>
      <p className="welcome-message">
        Ready to continue your journey through the New Testament?
      </p>

      <div className="dashboard-widgets">
        <div className="widget votd-widget">
            <h3><FaCross /> Verse of the Day</h3>
            <DailyVerse />
        </div>

        <div className="widget progress-widget">
          <h3><FaBookOpen /> Course Progress</h3>
          <p><strong>Completed:</strong> {completedLessonsCount} of {totalLessons} lessons</p>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="widget score-widget">
          <h3><FaChartLine /> Overall Score</h3>
          <p className="score-display">{overallScore}%</p>
        </div>

        <div className="widget cta-widget">
          <h3><FaCheckCircle /> {completedLessonsCount === totalLessons ? 'Review Lessons' : 'Continue Your Study'}</h3>
          <Link to={`/bible-study?page=${targetPage}`} className="cta-button">
            {completedLessonsCount === totalLessons 
              ? 'Review Lessons' 
              : `Continue: ${nextLesson.title}`
            }
          </Link>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;