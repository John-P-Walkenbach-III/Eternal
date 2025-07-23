import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { lifeOfChristData } from '../data/lifeOfChristData.jsx'; // Import the data
import './LifeOfChristPage.css'; // Reuse the same CSS for a consistent look
import ContentCard from '../components/ContentCard.jsx'; // Import the new component

const ChristTopicPage = () => {
  const { topicId } = useParams();
  const topicData = lifeOfChristData[topicId];

  // If no data is found for the topicId, redirect to the overview page.
  if (!topicData) {
    return <Navigate to="/life-of-christ" />;
  }

  return (
    <div className="life-of-christ-container">
      <div className="loc-header">
        <h1>{topicData.title}</h1>
        <p className="loc-subtitle">{topicData.introduction}</p>
      </div>

      {topicData.subTopics && topicData.subTopics.length > 0 && (
        <div className="sub-topics-section">
          <h2>In-Depth Studies</h2>
          <div className="sub-topics-grid">
            {topicData.subTopics.map(subTopic => (
              <Link to={`/life-of-christ/${topicId}/${subTopic.id}`} key={subTopic.id} className="sub-topic-card">
                <span className="sub-topic-icon">{subTopic.icon}</span>
                <h3>{subTopic.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="content-grid">
        {topicData.content.map((item, index) => (
          <ContentCard key={index} item={item} />
        ))}
      </div>

      

      <Link to="/life-of-christ" className="back-link">← Back to Life of Christ Overview</Link>
    </div>
  );
};

export default ChristTopicPage;