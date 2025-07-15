// This file contains the static structure of the New Testament course.

//
// This is the ONLY place you need to add your quiz links!
//
// 1. Create your quiz in Microsoft Forms and get the shareable link.
// 2. The 'key' must match the lesson ID (e.g., 'Matthew-1', 'Mark-16').
// 3. Paste the quiz link as the 'value'.
//
const quizLinks = {
  'Matthew-1': 'https://forms.office.com/r/HvcqFRV96W?embed=true',
  'Matthew-2': 'https://forms.office.com/r/uSBwWpnd3h?embed=true',
  'Matthew-3': 'https://forms.office.com/r/0WzbjFBtw7?embed=true',
  'Matthew-4': 'https://forms.office.com/r/Q7JCAfMA2B?embed=true',
  'Matthew-5': 'https://forms.office.com/r/AYF3ewa25X?embed=true',
  'Matthew-6': 'https://forms.office.com/r/6PKA54u4fL?embed=true',
  'Matthew-7': 'https://forms.office.com/r/JSs4rn7Kdd?embed=true',
  'Matthew-8': 'https://forms.office.com/r/smSnexAsNe?embed=true',
  'Matthew-9': 'https://forms.office.com/r/fMbBdHDDtD?embed=true',
  'Matthew-10': 'https://forms.office.com/r/GfzyjrFuEb?embed=true',
  // 'Matthew-11': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-12': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-13': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-14': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-15': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-16': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-17': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-18': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-19': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-20': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-21': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-22': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-23': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-24': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-25': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-26': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-27': 'https://your-link-for-matthew-3-goes-here',
  // 'Matthew-28': 'https://your-link-for-matthew-3-goes-here',
  // etc.
};

// A placeholder link for any quiz you haven't created yet.
const placeholderQuizUrl = 'https://forms.office.com/Pages/ResponsePage.aspx?id=...';

export const newTestamentCourse = [
  { book: 'Matthew', chapters: 28 },
  { book: 'Mark', chapters: 16 },
  { book: 'Luke', chapters: 24 },
  { book: 'John', chapters: 21 },
  { book: 'Acts', chapters: 28 },
  { book: 'Romans', chapters: 16 },
  { book: '1 Corinthians', chapters: 16 },
  { book: '2 Corinthians', chapters: 13 },
  { book: 'Galatians', chapters: 6 },
  { book: 'Ephesians', chapters: 6 },
  { book: 'Philippians', chapters: 4 },
  { book: 'Colossians', chapters: 4 },
  { book: '1 Thessalonians', chapters: 5 },
  { book: '2 Thessalonians', chapters: 3 },
  { book: '1 Timothy', chapters: 6 },
  { book: '2 Timothy', chapters: 4 },
  { book: 'Titus', chapters: 3 },
  { book: 'Philemon', chapters: 1 },
  { book: 'Hebrews', chapters: 13 },
  { book: 'James', chapters: 5 },
  { book: '1 Peter', chapters: 5 },
  { book: '2 Peter', chapters: 3 },
  { book: '1 John', chapters: 5 },
  { book: '2 John', chapters: 1 },
  { book: '3 John', chapters: 1 },
  { book: 'Jude', chapters: 1 },
  { book: 'Revelation', chapters: 22 },
];

// We can expand this array into a full list of lessons (chapters)
export const courseLessons = newTestamentCourse.flatMap(book =>
  Array.from({ length: book.chapters }, (_, i) => {
    const chapter = i + 1;
    const id = `${book.book.replace(/\s/g, '-')}-${chapter}`;
    return {
      id: id,
      book: book.book,
      chapter: chapter,
      title: `${book.book} ${chapter}`,
      quizUrl: quizLinks[id] || placeholderQuizUrl,
    };
  })
);


//temporarily put your embed code from Microsoft Forms here and copy the url and paste it above in the accompanying chapter: //


