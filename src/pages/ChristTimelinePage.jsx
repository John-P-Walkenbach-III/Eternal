import React from 'react';
import { Link } from 'react-router-dom';
import './ChristTimelinePage.css';

// We can reuse the topics from the main Life of Christ page for our timeline
const timelineEvents = [
  {
    title: "The Prophecies and His Birth",
    description: "Explore the ancient prophecies and the miraculous story of His birth.",
    path: "/life-of-christ/birth",
    icon: "🌟"
  },
  {
    title: "His Life and Ministry",
    description: "Journey through the teachings, parables, and the profound impact of His ministry.",
    path: "/life-of-christ/ministry",
    icon: "📖"
  },
  {
    title: "The Miracles",
    description: "Witness the incredible miracles He performed, demonstrating His divine power.",
    path: "/life-of-christ/miracles",
    icon: "✨"
  },
  {
    title: "The Crucifixion",
    description: "Understand the sacrifice He made upon the cross for all humanity.",
    path: "/life-of-christ/crucifixion",
    icon: "✝️"
  },
  {
    title: "The Resurrection",
    description: "Celebrate the ultimate victory over death and what His resurrection means for our faith.",
    path: "/life-of-christ/resurrection",
    icon: "🕊️"
  },
  {
    title: "The Ascension and His Promise",
    description: "Learn about His ascension into heaven and the promise of His return.",
    path: "/life-of-christ/ascension",
    icon: "☁️"
  }
];

const ChristTimelinePage = () => {
  return (
    <div className="timeline-container">
      <h1>A Visual Timeline of Christ's Life</h1>
      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-content">
              <span className="timeline-icon">{event.icon}</span>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <Link to={event.path} className="timeline-link">Learn More →</Link>
            </div>
          </div>
        ))}
      </div>
      <Link to="/life-of-christ" className="back-link">← Back to Overview</Link>
    </div>
  );
};

export default ChristTimelinePage;