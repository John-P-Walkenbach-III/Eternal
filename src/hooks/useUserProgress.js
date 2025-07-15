import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { courseLessons } from '../data/nt-course-data';

const LESSONS_PER_PAGE = 10;

export function useUserProgress() {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const progressDocRef = doc(db, 'user_progress', currentUser.uid);
        const docSnap = await getDoc(progressDocRef);
        setUserProgress(docSnap.exists() ? docSnap.data() : {});
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setUserProgress({}); // Ensure app doesn't crash on fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [currentUser]);

  // Use useMemo to avoid re-calculating these values on every render
  const progressStats = useMemo(() => {
    if (!userProgress) {
      return {
        completedLessonsCount: 0,
        totalLessons: courseLessons.length,
        overallScore: 0,
        nextLesson: courseLessons[0],
        targetPage: 1,
      };
    }

    const completedLessons = Object.values(userProgress).filter(p => p.completed);
    const completedLessonsCount = completedLessons.length;
    const totalScore = completedLessons.reduce((acc, p) => acc + (p.score || 0), 0);
    
    const firstUncompletedLesson = courseLessons.find(lesson => !userProgress[lesson.id]?.completed);
    const nextLesson = firstUncompletedLesson || courseLessons[0];
    const nextLessonIndex = courseLessons.findIndex(l => l.id === nextLesson.id);

    return {
      completedLessonsCount,
      totalLessons: courseLessons.length,
      overallScore: completedLessonsCount > 0 ? (totalScore / completedLessonsCount).toFixed(0) : 0,
      nextLesson,
      targetPage: Math.floor(nextLessonIndex / LESSONS_PER_PAGE) + 1,
    };
  }, [userProgress]);

  return { loading, userProgress, setUserProgress, ...progressStats };
}