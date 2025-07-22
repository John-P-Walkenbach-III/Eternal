export const achievements = [
  {
    id: 'first_quiz',
    title: 'First Step',
    description: 'Complete your first Bible study quiz.',
    icon: '✏️',
    criteria: { type: 'quiz_count', value: 1 },
  },
  {
    id: 'matthew_scholar',
    title: 'Matthew Scholar',
    description: 'Complete all quizzes for the book of Matthew.',
    icon: '🎓',
    criteria: { type: 'quiz_book', value: 'Matthew' },
  },
  {
    id: 'perfect_score',
    title: 'Top of the Class',
    description: 'Achieve a perfect 100% score on any quiz.',
    icon: '💯',
    criteria: { type: 'quiz_score', value: 100 },
  },
  {
    id: 'hall_of_faith_like',
    title: 'Verse Appreciator',
    description: 'Like a verse on the Daily Devotional page.',
    icon: '❤️',
    criteria: { type: 'like_count', collection: 'devotionals', value: 1 },
  },
  {
    id: 'testimony_amen',
    title: 'Encourager',
    description: 'Say "Amen" to a testimony.',
    icon: '🙌',
    criteria: { type: 'like_count', collection: 'testimonies', value: 1 },
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 10 different Bible study quizzes.',
    icon: '🏆',
    criteria: { type: 'quiz_count_total', value: 10 },
  },
  {
    id: 'community_pillar',
    title: 'Community Pillar',
    description: 'Show your support by saying "Amen" to 5 testimonies.',
    icon: '🏛️',
    criteria: { type: 'like_count_total', collection: 'testimonies', value: 5 },
  },
  // Add more achievements here!
];