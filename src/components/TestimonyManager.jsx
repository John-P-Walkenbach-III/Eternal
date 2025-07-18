import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import './TestimonyManager.css';

const TestimonyManager = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    const q = query(collection(db, 'testimonies'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
      }));
      setTestimonies(items);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching testimonies:", err);
      setError("Failed to load testimonies.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    setError('');
    try {
      const testimonyDoc = doc(db, 'testimonies', id);
      await updateDoc(testimonyDoc, { approved: true });
    } catch (err) {
      console.error("Error approving testimony:", err);
      setError("Failed to approve testimony.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimony permanently?")) {
      try {
        await deleteDoc(doc(db, 'testimonies', id));
      } catch (err) {
        console.error("Error deleting testimony:", err);
        setError("Failed to delete testimony.");
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="testimony-manager">
      {loading && <p>Loading testimonies...</p>}
      {error && <p className="status-message error">{error}</p>}
      <div className="testimony-list">
        {testimonies.map(testimony => (
          <div key={testimony.id} className={`testimony-item ${testimony.approved ? 'approved' : 'pending'}`}>
            <div className="testimony-content"> 
              <blockquote>
                {expandedIds.has(testimony.id) || testimony.story.length < 250
                  ? `"${testimony.story}"`
                  : `"${testimony.story.substring(0, 250)}..."`
                }
              </blockquote>
              <cite>- {testimony.displayName || 'Anonymous'} on {testimony.createdAt}</cite> 
              {testimony.story.length >= 250 && (
                <button onClick={() => toggleExpand(testimony.id)} className="expand-button">
                  {expandedIds.has(testimony.id) ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div> 
            <div className="testimony-actions">
              <span className={`status ${testimony.approved ? 'approved' : 'pending'}`}>
                {testimony.approved ? 'Approved' : 'Pending'}
              </span>
              <div className="action-buttons">
                {!testimony.approved && (
                  <button onClick={() => handleApprove(testimony.id)} className="approve">Approve</button>
                )}
                <button onClick={() => handleDelete(testimony.id)} className="delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {!loading && testimonies.length === 0 && <p>No testimonies submitted yet.</p>}
      </div>
    </div>
  );
};

export default TestimonyManager;