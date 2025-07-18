import React, { useState } from 'react';
import './CollapsibleText.css';

const CollapsibleText = ({ text, limit = 300 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }

  if (text.length <= limit) {
    return <p className="testimony-story">"{text}"</p>;
  }

  return (
    <div className="collapsible-text">
      <p className="testimony-story">
        {isExpanded ? `"${text}"` : `"${text.substring(0, limit)}..."`}
      </p>
      <button onClick={() => setIsExpanded(!isExpanded)} className="read-more-button">
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default CollapsibleText;