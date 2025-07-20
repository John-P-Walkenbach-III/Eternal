import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { lifeOfChristData } from '../data/lifeOfChristData.jsx'; // Import the data
import './LifeOfChristPage.css'; // Reuse the same CSS for a consistent look

const ChristTopicPage = () => {
  const { topicId } = useParams();
  const topicData = lifeOfChristData[topicId];

  // If no data is found for the topicId, redirect to the overview page.
  if (!topicData) {
    return <Navigate to="/life-of-christ" />;
  }

  const renderContentItem = (item, index) => {
    switch (item.type) {
      case 'video':
        return (
          <div key={index} className="content-card video-card">
            <div className="video-wrapper">
              <iframe
                src={item.source}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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
        <h1>{topicData.title}</h1>
        <p className="loc-subtitle">{topicData.introduction}</p>
      </div>
      <div className="content-grid">
        {topicData.content.map(renderContentItem)}
      </div>
      <Link to="/life-of-christ" className="back-link">← Back to Life of Christ Overview</Link>
    </div>
  );
};

export default ChristTopicPage;