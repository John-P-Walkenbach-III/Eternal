import React from 'react'
import BibleReader from '../components/BibleReader.jsx';
import VideoLinks from '../components/VideoLinks.jsx';

function Features() {
  return (
     <div className="features-page">
      <h2>Features</h2>
      <p>Explore the scriptures with our integrated Bible reader.</p>
      <BibleReader />
      <hr className="section-divider" />
      <VideoLinks />
    </div>
  )
}

export default Features
