import React from 'react';
import './Annotation.css';
import { useAuth } from '../context/AuthContext';

const Annotation = ({ annotation, isFeatured = false }) => {
  const { id, userDisplayName, comment, upvotes = [], userId } = annotation;
  const { currentUser } = useAuth();
    return (
    <div className={`annotation-card ${isFeatured ? 'featured' : ''}`}>
      {isFeatured && <div className="featured-banner">Featured Insight</div>}
      <div className="annotation-header">
        <span className="annotation-author">{userDisplayName}</span>
      </div>
      <p className="annotation-comment">"{comment}"</p>
      <div className="annotation-footer">
        {/* Placeholder for upvote button and delete button */}
      </div>
    </div>
  );
};

export default Annotation;