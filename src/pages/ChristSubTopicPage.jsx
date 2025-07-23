import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { lifeOfChristData } from '../data/lifeOfChristData.jsx';
import './LifeOfChristPage.css'; // Reuse styles
import ContentCard from '../components/ContentCard.jsx'; // Import the new component

const ChristSubTopicPage = () => {
  const { topicId, subTopicId } = useParams();
  const topicData = lifeOfChristData[topicId];
  const subTopicData = topicData?.subTopics?.find(st => st.id === subTopicId);

  if (!subTopicData) {
    return <Navigate to={`/life-of-christ/${topicId}`} />;
  }

  return (
    <div className="life-of-christ-container">
      <div className="loc-header">
        <h1>{subTopicData.title}</h1>
        <p className="loc-subtitle">{subTopicData.introduction}</p>
      </div>
      <div className="content-grid">
        {subTopicData.content.map((item, index) => (
          <ContentCard key={index} item={item} />
        ))}
      </div>

      

      <Link to={`/life-of-christ/${topicId}`} className="back-link">← Back to {topicData.title}</Link>
    </div>
  );
};

export default ChristSubTopicPage;