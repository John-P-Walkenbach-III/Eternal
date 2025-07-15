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
  name: 'Jentezen Franklin Church',
  url: 'https://www.youtube.com/@jentezenfranklinmedia',
  description: ' Jentezen Franklin Media'
 },
 {
  name: 'Prayer Video Of Forgiveness Of Sins',
  url: 'https://www.youtube.com/watch?v=FnsvT5Iy-Xw&pp=ygURcmVwZW50YW5jZSBwcmF5ZXI%3D',
  description: ' Daily Effective Prayer'
 },
 {
  name: 'Video-Psalms 51 Reading: A Prayer Of Repentance',
  url: 'https://www.youtube.com/watch?v=NCj5FPxQLOA&pp=ygURcmVwZW50YW5jZSBwcmF5ZXLSBwkJzQkBhyohjO8%3D',
  description: ' God Is With Us- A prayer of repentance'
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