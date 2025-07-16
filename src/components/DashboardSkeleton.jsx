import React from 'react';
import './DashboardSkeleton.css';

const DashboardSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton skeleton-welcome"></div>
      
      <div className="skeleton-verse-card">
        <div className="skeleton skeleton-verse-text"></div>
        <div className="skeleton skeleton-verse-text short"></div>
        <div className="skeleton skeleton-verse-ref"></div>
      </div>

      <div className="skeleton-progress-card">
        <div className="skeleton skeleton-progress-title"></div>
        <div className="skeleton skeleton-progress-text"></div>
        <div className="skeleton skeleton-progress-bar"></div>
      </div>

      <div className="skeleton skeleton-button"></div>
    </div>
  );
};

export default DashboardSkeleton;

