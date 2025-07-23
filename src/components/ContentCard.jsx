import React from 'react';
import { Link } from 'react-router-dom';

// We can re-use the same CSS from LifeOfChristPage
import '../pages/LifeOfChristPage.css';

const ContentCard = ({ item }) => {
  switch (item.type) {
    case 'video':
      return (
        <div className="content-card video-card">
          <div className="video-wrapper">
            <iframe src={item.source} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      );
    case 'scripture':
      return (
        <Link to={`/bible-reader/${encodeURIComponent(item.source)}`} className="content-card scripture-card">
          <img src={item.image} alt={item.title} className="card-image" />
          <div className="card-content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="card-source">Read: {item.source}</span>
          </div>
        </Link>
      );
    case 'article':
      // Articles open in a new tab
      return (
        <a href={item.source} target="_blank" rel="noopener noreferrer" className="content-card article-card">
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

export default ContentCard;