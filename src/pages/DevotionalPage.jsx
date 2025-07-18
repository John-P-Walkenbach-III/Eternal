import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import DailyVerse from '../components/DailyVerse.jsx';
import './DevotionalPage.css';

function DevotionalPage() {
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevotional = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        const devotionalsRef = collection(db, 'devotionals');
        const q = query(devotionalsRef, where('date', '==', today), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setDevotional(querySnapshot.docs[0].data());
        } else {
          setError('No devotional found for today.');
        }
      } catch (err) {
        console.error("Error fetching devotional:", err);
        setError('Failed to load the devotional.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevotional();
  }, []);

  return (
    <div className="devotional-page">
      <div className="devotional-header">
        <h1>Daily Devotional</h1>
        <p>Take a moment to reflect on the Word and what it means for your life today.</p>
      </div>
      
      <DailyVerse />

      <hr className="section-divider" />

      <section className="devotional-content">
        {loading && <p>Loading today's reflection...</p>}
        {error && <p className="status-message error">{error}</p>}
        {devotional && (
          <>
            <h2>{devotional.title}</h2>
            <div className="reflection-text">{devotional.content}</div>
          </>
        )}
      </section>
    </div>
  );
}

export default DevotionalPage;