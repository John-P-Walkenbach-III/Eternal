import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query, runTransaction, serverTimestamp, writeBatch, where } from 'firebase/firestore';

const DevotionalManager = () => {
  const [devotionals, setDevotionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newVerse, setNewVerse] = useState({ reference: '', text: '', date: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVerse, setEditingVerse] = useState(null);

  const fetchDevotionals = async () => {
    setLoading(true);
    setError('');
    try {
      const versesRef = collection(db, 'devotionals');
      const q = query(versesRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const devotionalList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevotionals(devotionalList);
    } catch (err) {
      console.error("Error fetching devotionals:", err);
      setError("Failed to load devotionals. You may need to create a Firestore index for 'devotionals' ordered by 'date' descending.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const handleAddVerse = async (e) => {
    e.preventDefault();
    if (!newVerse.reference.trim() || !newVerse.text.trim() || !newVerse.date) {
      return alert("Please fill out reference, text, and date.");
    }
    setIsSubmitting(true);

    const verseId = newVerse.reference.replace(/\s|:/g, '_');
    const verseDocRef = doc(db, 'devotionals', verseId);

    try {
      await runTransaction(db, async (transaction) => {
        const verseDoc = await transaction.get(verseDocRef);
        if (verseDoc.exists()) {
          throw new Error("A devotional with this reference already exists. Please use the Edit button to update it.");
        }
        transaction.set(verseDocRef, {
          reference: newVerse.reference.trim(),
          text: newVerse.text.trim(),
          description: newVerse.description.trim(),
          date: newVerse.date,
          likeCount: 0,
          isFeatured: false,
          createdAt: serverTimestamp()
        });
      });
      setNewVerse({ reference: '', text: '', date: '', description: '' });
      fetchDevotionals();
    } catch (err) {
      console.error("Error adding devotional:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVerse = async (e) => {
    e.preventDefault();
    if (!editingVerse) return;
    setIsSubmitting(true);

    try {
      const batch = writeBatch(db);
      const verseToUpdateRef = doc(db, 'devotionals', editingVerse.id);

      if (editingVerse.isFeatured) {
        const featuredQuery = query(collection(db, 'devotionals'), where("isFeatured", "==", true));
        const snapshot = await getDocs(featuredQuery);
        snapshot.forEach(doc => {
          if (doc.id !== editingVerse.id) {
            batch.update(doc.ref, { isFeatured: false });
          }
        });
      }

      batch.update(verseToUpdateRef, {
        text: editingVerse.text,
        description: editingVerse.description,
        date: editingVerse.date,
        isFeatured: editingVerse.isFeatured || false,
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      setEditingVerse(null);
      fetchDevotionals();
    } catch (err) {
      console.error("Error updating verse:", err);
      alert("Failed to update verse. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this devotional?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'devotionals', id));
      fetchDevotionals();
    } catch (err) {
      console.error("Error deleting devotional:", err);
      alert("Failed to delete devotional. Please try again.");
    }
  };

  if (loading) return <p>Loading devotionals...</p>;
  if (error) return <p className="status-message error">{error}</p>;

  if (editingVerse) {
    return (
      <div className="manager-container">
        <form onSubmit={handleUpdateVerse} className="admin-form">
          <h4>Editing: {editingVerse.reference}</h4>
          <input
            type="date"
            value={editingVerse.date || ''}
            onChange={(e) => setEditingVerse({ ...editingVerse, date: e.target.value })}
            required
          />
          <textarea
            placeholder="Verse Text"
            value={editingVerse.text}
            onChange={(e) => setEditingVerse({ ...editingVerse, text: e.target.value })}
            required
          />
          <textarea
            placeholder="Description / Short Teaching"
            value={editingVerse.description || ''}
            onChange={(e) => setEditingVerse({ ...editingVerse, description: e.target.value })}
          />
          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              checked={!!editingVerse.isFeatured}
              onChange={(e) => setEditingVerse({ ...editingVerse, isFeatured: e.target.checked })}
            />
            Feature this Devotional
          </label>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => setEditingVerse(null)} className="cancel-button">Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="manager-container">
      <form onSubmit={handleAddVerse} className="admin-form">
        <h4>Add New Devotional</h4>
        <input
          type="text"
          placeholder="Verse Reference (e.g., John 3:16)"
          value={newVerse.reference}
          onChange={(e) => setNewVerse({ ...newVerse, reference: e.target.value })}
          required
        />
        <input
          type="date"
          value={newVerse.date}
          onChange={(e) => setNewVerse({ ...newVerse, date: e.target.value })}
          required
        />
        <textarea
          placeholder="Verse Text"
          value={newVerse.text}
          onChange={(e) => setNewVerse({ ...newVerse, text: e.target.value })}
          required
        />
        <textarea
          placeholder="Description / Short Teaching (Optional)"
          value={newVerse.description}
          onChange={(e) => setNewVerse({ ...newVerse, description: e.target.value })}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Devotional'}
        </button>
      </form>
      <ul className="manager-list">
        {devotionals.map(verse => (
          <li key={verse.id} className="manager-item">
            <div className="item-info">
              <strong>{verse.reference || 'No Reference'} ({verse.date})</strong>
              <p><em>{verse.description || 'No Description'}</em></p>
              <p>"{verse.text || 'No Text'}"</p>
              <div className="item-meta">
                <span>Likes: {verse.likeCount || 0}</span>
                {verse.isFeatured && <span className="featured-tag">Featured</span>}
              </div>
            </div>
            <div className="item-actions">
              <button onClick={() => setEditingVerse(verse)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(verse.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevotionalManager;
