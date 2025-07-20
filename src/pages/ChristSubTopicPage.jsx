import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { lifeOfChristData } from '../data/lifeOfChristData.jsx';
import './LifeOfChristPage.css'; // Reuse styles

const ChristSubTopicPage = () => {
  const { topicId, subTopicId } = useParams();
  const topicData = lifeOfChristData[topicId];
  const subTopicData = topicData?.subTopics?.find(st => st.id === subTopicId);

  if (!subTopicData) {
    return <Navigate to={`/life-of-christ/${topicId}`} />;
  }

  // This is the same rendering logic from ChristTopicPage,
  // we could extract it to a shared component later if we want.
  const renderContentItem = (item, index) => {
    switch (item.type) {
      case 'video':
        return (
          <div key={index} className="content-card video-card">
            <div className="video-wrapper">
              <iframe src={item.source} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        );
      case 'scripture':
        return (
          <Link to={`/bible-reader/${encodeURIComponent(item.source)}`} key={index} className="content-card scripture-card">
            <img src={item.image} alt={item.title} className="card-image" />
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="card-source">Read: {item.source}</span>
            </div>
          </Link>
        );
      case 'article':
        return (
          <a href={item.source} target="_blank" rel="noopener noreferrer" key={index} className="content-card article-card">
            <img src={item.image} alt={item.title} className="card-image" />
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="card-source">Read Full Article</span>
            </div>
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div className="life-of-christ-container">
      <div className="loc-header">
        <h1>{subTopicData.title}</h1>
        <p className="loc-subtitle">{subTopicData.introduction}</p>
      </div>
      <div className="content-grid">
        {subTopicData.content.map(renderContentItem)}
      </div>
      <Link to={`/life-of-christ/${topicId}`} className="back-link">← Back to {topicData.title}</Link>
    </div>
  );
};

export default ChristSubTopicPage;