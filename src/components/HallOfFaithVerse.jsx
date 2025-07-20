import React, { useState } from 'react';
import { FaHeart, FaCrown, FaShare } from 'react-icons/fa';

const HallOfFaithVerse = ({ verse, index }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleShare = async () => {
    if (!verse) return;

    const shareText = `"${verse.text}" - ${verse.reference}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verse from the Hall of Faith',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Reset after 2 seconds
      });
    }
  };

  return (
    <li className="verse-card">
      <span className="rank">{index === 0 ? <FaCrown /> : `#${index + 1}`}</span>
      <blockquote className="verse-text">"{verse.text}"</blockquote>
      <cite className="verse-reference">{verse.reference}</cite>
      <div className="verse-card-footer">
        <div className="like-count"><FaHeart /> {verse.likeCount}</div>
        <button onClick={handleShare} className="share-button">
          {copySuccess ? copySuccess : (
            <><FaShare /> Share</>
          )}
        </button>
      </div>
    </li>
  );
};

export default HallOfFaithVerse;