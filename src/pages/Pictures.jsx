import React from 'react'

// You can add your image details to this array.
// Make sure the `src` path starts with `/images/` and matches the filename in your `public/images` folder.
const picturesData = [
  {
    id: 1,
    src: '/images/My_Jesus2.png', // Replace with your image file
    alt: 'A beautiful landscape of 3 crosses',
    title: 'Welcome Home Sons And Daughters'
  },
  {
    id: 2,
    src: '/images/religion1.jpg', // Replace with your image file
    alt: 'A Sunset High In The Misty Mountains',
    title: 'A Sunset/Sunrise High In The Clouds With Cross'
  },
  {
    id: 3,
    src: '/images/JesusText.JPG', // Replace with your image file
    alt: 'Beautiful Sunset With An Inspirational Message',
    title: 'Beautiful Sunset With An Inspirational Message'
  },
  {
    id: 4,
    src: '/images/dove.jpg',
    alt: 'Dove',
    title: 'Dove/Spirit Descending To Cross'
  },
  {
    id: 5,
    src: '/images/cavecross.jpg',
    alt: 'View Inside A Cave Looking Out At 3 Crosses',
    title: 'Looking Out Of A Cave',
    },
  {
    id: 6,
    src: '/images/3cross.jpg',
    alt: 'Holy  Cross',
    title: 'Light Behind The Clouds',
    },
  {
    id: 7,
    src: '/images/pier.jpg',
    alt: 'Looking Down At A Pier',
    title: 'Looking Down At A Pier',
    },
  {
    id: 8,
    src: '/images/lgdove.jpg',
    alt: 'Holy Spirit Descending To Cross',
    title: 'Holy Spirit Descending To Cross',
    }
  // Add more picture objects here as you gather them
];

function Pictures() {
  return (
    <div className="pictures-page">
      <h2>My Picture Library</h2>
      <p>A Collection Of Christian Pictures.</p>
      <div className="picture-gallery">
        {picturesData.map(pic => (
          <div key={pic.id} className="picture-card">
            <img src={pic.src} alt={pic.alt} />
            <div className="picture-info">
              <h4>{pic.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pictures
