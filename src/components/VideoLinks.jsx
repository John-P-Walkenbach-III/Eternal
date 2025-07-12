import React from 'react';

const videoLinks = [
  {
    name: 'Amazing Facts',
    url: 'https://www.youtube.com/user/AmazingFacts',
    description: 'Explore in-depth biblical teachings and prophecies.'
  },
  {
    name: 'Joel Osteen',
    url: 'https://www.youtube.com/user/joelosteenministries',
    description: 'Listen to uplifting messages of hope and faith.'
  },
 {
    name: "Elevation Church",
    url: "https://www.youtube.com/@elevationchurch",
    description: "Worship music and sermons from Pastor Stephen Furtick and Elevation Church."
 },
 {
    name: "Jentezen Franklin Church",
    url: "https://www.youtube.com/@jentezenfranklinmedia",
    description: "Jentezen Franklin Media"
 }
];

function VideoLinks() {
  return (
    <div className="video-links-container">
      <h3>Recommended Channels</h3>
      <div className="video-links-grid">
        {videoLinks.map(link => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="video-link-card">
            <h4>{link.name}</h4>
            <p>{link.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default VideoLinks;