import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query, runTransaction, serverTimestamp } from 'firebase/firestore';

const DevotionalManager = () => {
  const [devotionals, setDevotionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newVerse, setNewVerse] = useState({ reference: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDevotionals = async () => {
    setLoading(true);
    setError('');
    try {
      const versesRef = collection(db, 'devotionals');
      // Order by likeCount to see popular or potentially problematic ones easily
      const q = query(versesRef, orderBy('likeCount', 'desc'));
      const snapshot = await getDocs(q);
      const devotionalList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevotionals(devotionalList);
    } catch (err) {
      console.error("Error fetching devotionals:", err);
      setError("Failed to load devotionals. You may need to create a Firestore index for 'devotionals' ordered by 'likeCount' descending.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const handleAddVerse = async (e) => {
    e.preventDefault();
    if (!newVerse.reference.trim() || !newVerse.text.trim()) {
      return alert("Please fill out both reference and text.");
    }
    setIsSubmitting(true);

    const verseId = newVerse.reference.replace(/\s|:/g, '_');
    const verseDocRef = doc(db, 'devotionals', verseId);

    try {
      await runTransaction(db, async (transaction) => {
        const verseDoc = await transaction.get(verseDocRef);
        const dataToSet = {
          reference: newVerse.reference.trim(),
          text: newVerse.text.trim(),
          createdAt: serverTimestamp()
        };

        if (!verseDoc.exists()) {
          dataToSet.likeCount = 0;
        }
        
        transaction.set(verseDocRef, dataToSet, { merge: true });
      });
      setNewVerse({ reference: '', text: '' });
      fetchDevotionals(); // Refresh the list
    } catch (err) {
      console.error("Error adding devotional:", err);
      alert("Failed to add verse. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this verse? This will also remove it from the Hall of Faith.")) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'devotionals', id));
      fetchDevotionals(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting devotional:", err);
      alert("Failed to delete verse. Please try again.");
    }
  };

  if (loading) return <p>Loading devotionals...</p>;
  if (error) return <p className="status-message error">{error}</p>;

  return (
    <div className="manager-container">
      <form onSubmit={handleAddVerse} className="admin-form">
        <h4>Add or Update a Devotional Verse</h4>
        <p>To add a new verse, fill out the fields. To update an existing verse's text, use its exact reference.</p>
        <input
          type="text"
          placeholder="Verse Reference (e.g., John 3:16)"
          value={newVerse.reference}
          onChange={(e) => setNewVerse({ ...newVerse, reference: e.target.value })}
          required
        />
        <textarea
          placeholder="Verse Text"
          value={newVerse.text}
          onChange={(e) => setNewVerse({ ...newVerse, text: e.target.value })}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Verse'}
        </button>
      </form>
      <ul className="manager-list">
        {devotionals.map(verse => (
          <li key={verse.id} className="manager-item">
            <div className="item-info">
              <strong>{verse.reference || 'No Reference'}</strong>
              <p>"{verse.text || 'No Text - THIS IS LIKELY THE EMPTY VERSE'}"</p>
              <span>Likes: {verse.likeCount || 0}</span>
            </div>
            <button onClick={() => handleDelete(verse.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevotionalManager;