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
    src: '/images/religion1.jpg',
    alt: 'A Sunset High In The Misty Mountains',
    title: 'A Sunset/Sunrise High In The Clouds With Cross'
  },
  {
    id: 3,
    src: '/images/JesusText.JPG',
    alt: 'Beautiful Sunset With An Inspirational Message',
    title: 'Beautiful Sunset With An Inspirational Message'
  },
  {
    id: 4,
    src: '/images/cavecross.jpg',
    alt: 'View Inside A Cave Looking Out At 3 Crosses',
    title: 'Looking Out Of A Cave'
  },
  {
    id: 5,
    src: '/images/3cross.jpg',
    alt: 'Holy  Cross',
    title: 'Light Behind The Clouds'
  },
  {
    id: 6,
    src: '/images/pier.jpg',
    alt: 'Looking Down At A Pier',
    title: 'Looking Down At A Pier'
  },
  {
    id: 7,
    src: '/images/lgdove.jpg',
    alt: 'Holy Spirit Descending To Cross',
    title: 'Holy Spirit Descending To Cross'
  },
  {
    id: 8,
    src: '/images/bck3.jpg',
    alt: "wavy plains with hovering cross",
    title: "Wavy Plains With Hovering Cross"
  },
  {
    id: 9,
    src: '/images/bck4.jpg',
    alt: 'Ocean Sunset With Palms And Scripture Reading',
    title: 'Ocean Sunset With Palms And Scripture Reading'
  },
  {
    id: 10,
    src: '/images/bck5.jpg',
    alt: "Mountain Brook At Sunrise With Scripture Reading",
    title: "Mountain Brook At Sunrise With Scripture Reading"
  },
  {
    id: 11,
    src: '/images/bck6.jpg',
    alt: "Pretty Flower With Scripture Reading",
    title: "Shooting Star Flower With Scripture Reading"
  },
  {
    id: 12,
    src: "/images/chosen.jpg",
    alt: "English Daisy With Scripture Reading",
    title: "English Daisy With Scripture Reading"
  },
  {
    id: 13,
    src: "/images/OIP.jpg",
    alt: "Sunset In The Mountains With A Cross",
    title: "Sunset In The Mountains With A Cross"
  }
];

function Pictures() {
  return (
    <div className="pictures-page">
      <h2>Picture Library</h2>
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
