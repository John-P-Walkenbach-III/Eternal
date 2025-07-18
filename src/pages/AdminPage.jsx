import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import ResourceEditor from '../components/ResourceEditor.jsx';
import './AdminPage.css';

function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleResetLeaderboard = async () => {
    if (!window.confirm("Are you sure you want to delete ALL scores from the leaderboard? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    setStatus('Resetting leaderboard...');

    try {
      const leaderboardCol = collection(db, 'leaderboard');
      const snapshot = await getDocs(leaderboardCol);

      if (snapshot.empty) {
        setStatus("Leaderboard is already empty.");
        setLoading(false);
        return;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setStatus("Leaderboard has been successfully reset.");
    } catch (err) {
      console.error("Error resetting leaderboard:", err);
      setStatus("Error: Failed to reset leaderboard. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <div className="admin-section">
        <h2>Game Management</h2>
        <button onClick={handleResetLeaderboard} disabled={loading}>Reset Leaderboard</button>
        {status && <p className="status-message">{status}</p>}
      </div>

      <div className="admin-section">
        <h2>Re-Entry Resource Management</h2>
        <ResourceEditor collectionName="housingResources" title="Housing Resources" />
        <ResourceEditor collectionName="employmentResources" title="Employment Resources" />
        <ResourceEditor collectionName="counselingResources" title="Counseling Resources" />
        <ResourceEditor collectionName="spiritualResources" title="Spiritual Resources" />
      </div>
    </div>
  );
}

export default AdminPage;