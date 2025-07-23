import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { achievements } from '../data/achievementsData.js';
import { bibleStudyTopics } from '../data/bibleStudyTopics.jsx';

export const useAchievements = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const prevUnlockedRef = useRef(new Set());

  useEffect(() => {
    const checkAchievements = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const unlocked = new Set();

      // Fetch all user data in parallel
      const scoresPromise = getDocs(query(collection(db, 'quizScores'), where('userId', '==', currentUser.uid)));
      const devotionalSnapshotPromise = getDocs(collection(db, 'devotionals'));
      const testimonySnapshotPromise = getDocs(collection(db, 'testimonies'));

      const [scoresSnapshot, devotionalSnapshot, testimonySnapshot] = await Promise.all([
        scoresPromise,
        devotionalSnapshotPromise,
        testimonySnapshotPromise,
      ]);

      // --- Process Quiz Achievements ---
      const completedQuizzes = scoresSnapshot.docs.map(doc => doc.data());
      if (completedQuizzes.length >= 1) {
        unlocked.add('first_quiz');
      }
      if (completedQuizzes.length >= 10) {
        unlocked.add('quiz_master');
      }
      if (completedQuizzes.some(q => q.score === 100)) {
        unlocked.add('perfect_score');
      }

      const matthewBook = bibleStudyTopics.find(t => t.category === "The New Testament")
                                          ?.books.find(b => b.name === "Matthew");
      if (matthewBook) {
        const matthewQuizzes = matthewBook.quizzes.length;
        const completedMatthewQuizzes = completedQuizzes.filter(q => q.quizTitle.includes("Matthew")).length;
        if (completedMatthewQuizzes >= matthewQuizzes) {
          unlocked.add('matthew_scholar');
        }
      }

      // --- Process Like/Amen Achievements ---
      const devotionalLikePromises = devotionalSnapshot.docs.map(devotionalDoc => {
        const userLikeRef = doc(db, 'devotionals', devotionalDoc.id, 'likes', currentUser.uid);
        return getDoc(userLikeRef);
      });
      const devotionalLikeSnaps = await Promise.all(devotionalLikePromises);
      const devotionalLikesCount = devotionalLikeSnaps.filter(snap => snap.exists()).length;
      if (devotionalLikesCount >= 1) {
        unlocked.add('hall_of_faith_like');
      }

      const testimonyAmenPromises = testimonySnapshot.docs.map(testimonyDoc => {
        const userAmenRef = doc(db, 'testimonies', testimonyDoc.id, 'likes', currentUser.uid);
        return getDoc(userAmenRef);
      });
      const testimonyAmenSnaps = await Promise.all(testimonyAmenPromises);
      const testimonyAmenCount = testimonyAmenSnaps.filter(snap => snap.exists()).length;
      if (testimonyAmenCount >= 1) {
        unlocked.add('testimony_amen');
      }
      if (testimonyAmenCount >= 5) {
        unlocked.add('community_pillar');
      }

      // Compare with previous state to find newly unlocked achievements
      const previouslyUnlocked = prevUnlockedRef.current;
      unlocked.forEach(id => {
        if (!previouslyUnlocked.has(id)) {
          const achievement = achievements.find(a => a.id === id);
          if (achievement) {
            addNotification(`${achievement.icon} Achievement Unlocked: ${achievement.title}`);
          }
        }
      });

      setUnlockedAchievements(unlocked);
      prevUnlockedRef.current = unlocked; // Update the ref for the next check
      setLoading(false);
    };

    checkAchievements();
  }, [currentUser, addNotification]);

  return { achievements, unlockedAchievements, loading };
};
