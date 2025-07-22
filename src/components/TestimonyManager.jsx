import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';

const TestimonyManager = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTestimony, setEditingTestimony] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonies = async () => {
    setLoading(true);
    setError('');
    try {
      const testimoniesRef = collection(db, 'testimonies');
      const q = query(testimoniesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const testimonyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonies(testimonyList);
    } catch (err) {
      console.error("Error fetching testimonies:", err);
      setError("Failed to load testimonies. You may need to create a Firestore index for 'testimonies' ordered by 'createdAt' descending.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const handleUpdateTestimony = async (e) => {
    e.preventDefault();
    if (!editingTestimony) return;
    setIsSubmitting(true);

    try {
      const testimonyRef = doc(db, 'testimonies', editingTestimony.id);
      await updateDoc(testimonyRef, {
        story: editingTestimony.story,
        displayName: editingTestimony.displayName,
        ageSaved: Number(editingTestimony.ageSaved),
        isBaptized: editingTestimony.isBaptized,
      });
      setEditingTestimony(null);
      fetchTestimonies();
    } catch (err) {
      console.error("Error updating testimony:", err);
      alert("Failed to update testimony.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestimony = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this testimony?")) {
      try {
        await deleteDoc(doc(db, 'testimonies', id));
        fetchTestimonies();
      } catch (err) {
        console.error("Error deleting testimony:", err);
        alert("Failed to delete testimony.");
      }
    }
  };

  if (loading) return <p>Loading testimonies...</p>;
  if (error) return <p className="status-message error">{error}</p>;

  if (editingTestimony) {
    return (
      <div className="manager-container">
        <form onSubmit={handleUpdateTestimony} className="admin-form">
          <h4>Editing Testimony by {editingTestimony.displayName}</h4>
          <label>Display Name</label>
          <input type="text" value={editingTestimony.displayName} onChange={(e) => setEditingTestimony({ ...editingTestimony, displayName: e.target.value })} required />
          <label>Story</label>
          <textarea value={editingTestimony.story} onChange={(e) => setEditingTestimony({ ...editingTestimony, story: e.target.value })} required />
          <label>Age Saved</label>
          <input type="number" value={editingTestimony.ageSaved} onChange={(e) => setEditingTestimony({ ...editingTestimony, ageSaved: e.target.value })} required />
          <label className="admin-checkbox-label">
            <input type="checkbox" checked={!!editingTestimony.isBaptized} onChange={(e) => setEditingTestimony({ ...editingTestimony, isBaptized: e.target.checked })} />
            Baptized
          </label>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => setEditingTestimony(null)} className="cancel-button">Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="manager-container">
      <ul className="manager-list">
        {testimonies.map(testimony => (
          <li key={testimony.id} className="manager-item">
            <div className="item-info">
              <strong>By: {testimony.displayName}</strong> (Saved at {testimony.ageSaved})
              <p>"{testimony.story}"</p>
              <div className="item-meta">
                <span>Amens: {testimony.likeCount || 0}</span>
                <span>Baptized: {testimony.isBaptized ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="item-actions">
              <button onClick={() => setEditingTestimony(testimony)} className="edit-button">Edit</button>
              <button onClick={() => handleDeleteTestimony(testimony.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestimonyManager;

