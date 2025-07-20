import React from 'react';
import { Link } from 'react-router-dom';
import './LifeOfChristPage.css';

const topics = [
  {
    title: "The Prophecies and His Birth",
    description: "Explore the ancient prophecies foretelling His arrival and the miraculous story of His birth.",
    path: "/life-of-christ/birth",
    icon: "🌟"
  },
  {
    title: "His Life and Ministry",
    description: "Journey through the teachings, parables, and the profound impact of His ministry on earth.",
    path: "/life-of-christ/ministry",
    icon: "📖"
  },
  {
    title: "The Miracles",
    description: "Witness the incredible miracles He performed, demonstrating His divine power and compassion.",
    path: "/life-of-christ/miracles",
    icon: "✨"
  },
  {
    title: "The Crucifixion",
    description: "Understand the sacrifice He made, the events leading to the cross, and its significance for all humanity.",
    path: "/life-of-christ/crucifixion",
    icon: "✝️"
  },
  {
    title: "The Resurrection",
    description: "Celebrate the ultimate victory over death and what His resurrection means for our faith and future.",
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

const LifeOfChristPage = () => {
  return (
    <div className="life-of-christ-container">
      <div className="loc-header">
        <h1>The Life of Jesus Christ</h1>
        <p className="loc-subtitle">A journey through the most important story ever told. Discover the truth, the life, and the hope found in Him.</p>
      </div>
      <div className="loc-topics-grid">
        {topics.map((topic) => (
          <Link to={topic.path} key={topic.title} className="loc-topic-card">
            <div className="loc-topic-icon">{topic.icon}</div>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LifeOfChristPage;