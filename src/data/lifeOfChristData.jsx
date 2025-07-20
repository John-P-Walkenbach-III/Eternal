export const lifeOfChristData = {
  birth: {
    title: "The Prophecies and His Birth",
    introduction: "The story of Jesus's birth is not just a historical event; it is the fulfillment of centuries of prophecy and the beginning of God's ultimate plan for salvation. Explore the scriptures, teachings, and historical context surrounding this miraculous moment.",
    content: [
      {
        type: 'scripture',
        title: 'Prophecy of the Virgin Birth',
        description: 'Isaiah foretells that a virgin will conceive and give birth to a son, who will be called Immanuel, meaning "God with us".',
        source: 'Isaiah 7:14',
        image: '/images/nativity.jpg' // Placeholder image
      },
      {
        type: 'video',
        title: 'The Nativity Story',
        description: 'A visual depiction of the events surrounding the birth of Jesus, from the journey to Bethlehem to the visit of the Magi.',
        source: 'https://www.youtube.com/embed/AuvPKdzeMF8', // Correct YouTube embed URL
        image: 'https://picsum.photos/seed/nativity/400/200'
      },
      {
        type: 'scripture',
        title: 'The Annunciation',
        description: 'The angel Gabriel appears to Mary to announce that she will be the mother of the Son of God.',
        source: 'Luke 1:26-38',
        image: '/images/Gabriel.jpg'
      },
      {
        type: 'article',
        title: 'The Historical Context of Bethlehem',
        description: 'Learn about the significance of Bethlehem in Jewish history and why it was the prophesied birthplace of the Messiah.',
        source: 'https://www.biblicalarchaeology.org/daily/biblical-sites-places/biblical-archaeology-sites/the-star-of-bethlehem/', // Example article URL
        image: '/images/bethlehem.jpg'
      }
    ]
  },
  ministry: {
    title: "His Life and Ministry",
    introduction: "Journey through the teachings, parables, and the profound impact of His ministry on earth.",
    content: [
      {
        type: "scripture",
        title: "The Parable Of The Wheat And Tares",
        description: "Coexistence Of Good And Evil",
        source: "Matthew 13:24-30",
        image: "/images/wheat.jpg",

      },
      {
        type: "video",
        title: "The Parable Of The Wheat And The Weeds",
        description: "Amazing Facts President Doug Batchelor Explains This Famous Parable From Jesus' Life.",
        source: "https://www.youtube.com/embed/sQ4gH5a3Gq4",
        image: "/images/wheat.jpg",
      },


      {
        type: "article",
        title: ""
      },
      // Content for ministry will go here
    ]
  },
  // In c:\Users\johnw\Full Stack\Eternal\src\data\lifeOfChristData.jsx

// ... inside the lifeOfChristData object ...
  miracles: {
    title: "The Miracles",
    introduction: "Witness the incredible miracles He performed, demonstrating His divine power and compassion. Each act was not just a display of power, but a profound lesson in faith and love.",
    content: [
      {
        type: 'scripture',
        title: 'Walking on Water',
        description: 'In the midst of a storm, Jesus walks on the sea to meet His disciples, teaching a powerful lesson about faith over fear.',
        source: 'Matthew 14:22-33',
        image: '/images/JesusWater.jpeg' // Example path
      },
      {
        type: 'video',
        title: 'The Feeding of the 5,000',
        description: 'From the series "The Chosen" Jesus fed a massive crowd with just five loaves and two fish.',
        source: 'https://www.youtube.com/embed/gxT8N0uJJs8?si=7CvsXO812___sHSA', // Example embed URL
        image: '/images/life-of-christ/feeding-5000.jpg'
      },
      {
        type: 'article',
        title: 'The Healing of the Blind Man',
        description: 'An analysis of the story of Jesus healing the man born blind, and what it teaches us about spiritual blindness and sight.',
        source: 'https://www.gotquestions.org/man-born-blind.html', // Example article
        image: '/images/JesusHeals.jpeg'
      },
      {
        type: 'scripture',
        title: 'Raising Lazarus from the Dead',
        description: 'The most profound miracle, where Jesus demonstrates His power over death itself by raising his friend Lazarus.',
        source: 'John 11:1-44',
        image: '/images/Lazarus.jpeg'
      }
    ]
  },
// ... other sections ...

  crucifixion: {
    title: "The Crucifixion",
    introduction: "Understand the sacrifice He made, the events leading to the cross, and its significance for all humanity.",
    content: []
  },
  resurrection: {
    title: "The Resurrection",
    introduction: "Celebrate the ultimate victory over death and what His resurrection means for our faith and future.",
    content: []
  },
  ascension: {
    title: "The Ascension and His Promise",
    introduction: "Learn about His ascension into heaven and the promise of His return.",
    content: []
  }
};
