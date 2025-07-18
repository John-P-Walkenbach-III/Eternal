import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import './PrayerJournalPage.css';

const PrayerJournalPage = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', category: 'General' });
  const [editingEntry, setEditingEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const journalCollectionRef = collection(db, 'users', currentUser.uid, 'journalEntries');
    const q = query(journalCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(fetchedEntries);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching journal entries:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (newEntry.title.trim() === '' || newEntry.content.trim() === '' || !newEntry.category) return;

    try {
      const journalCollectionRef = collection(db, 'users', currentUser.uid, 'journalEntries');
      await addDoc(journalCollectionRef, {
        title: newEntry.title,
        content: newEntry.content,
        createdAt: serverTimestamp(),
        category: newEntry.category,
      });
      setNewEntry({ title: '', content: '', category: 'General' });
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  };

  const handleUpdateEntry = async (e) => {
    e.preventDefault();
    if (!editingEntry || editingEntry.title.trim() === '' || editingEntry.content.trim() === '') return;

    try {
      const entryDocRef = doc(db, 'users', currentUser.uid, 'journalEntries', editingEntry.id);
      await updateDoc(entryDocRef, {
        title: editingEntry.title,
        content: editingEntry.content,
      });
      setEditingEntry(null);
    } catch (error) {
      console.error("Error updating entry: ", error);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const entryDocRef = doc(db, 'users', currentUser.uid, 'journalEntries', id);
        await deleteDoc(entryDocRef);
      } catch (error) {
        console.error("Error deleting entry: ", error);
      }
    }
  };

  const startEditing = (entry) => {
    setEditingEntry({ ...entry });
  };

  // --- Filtering Logic ---
  const categories = ['All', ...new Set(entries.map(entry => entry.category || 'General'))];
  const filteredEntries = filterCategory === 'All'
    ? entries
    : entries.filter(entry => (entry.category || 'General') === filterCategory);

  if (isLoading) {
    return <div className="journal-container">Loading journal...</div>;
  }

  return (
    <div className="journal-container">
      <h1>My Prayer Journal</h1>

      {editingEntry ? (
        <form onSubmit={handleUpdateEntry} className="journal-form">
          <h2>Edit Entry</h2>
          <input type="text" value={editingEntry.title} onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })} required />
          <textarea value={editingEntry.content} onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })} required></textarea>
          <div className="form-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingEntry(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAddEntry} className="journal-form">
          <h2>New Entry</h2>
          <input type="text" placeholder="Title" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} required />
          <textarea placeholder="Write your prayer or reflection..." value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} required></textarea>
          <select value={newEntry.category} onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}>
            <option value="General">General</option>
            <option value="Prayer">Prayer</option>
            <option value="Reflection">Reflection</option>
            <option value="Gratitude">Gratitude</option>
            {/* The 'Verse' category will be added automatically when saved from the devotional page */}
          </select>
          <button type="submit">Add Entry</button>
        </form>
      )}

      <div className="journal-filters">
        <span>Filter by:</span>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${filterCategory === category ? 'active' : ''}`}
            onClick={() => setFilterCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="entries-list">
        {filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
          <div key={entry.id} className="journal-entry">
            <div className="entry-header">
              <h3>{entry.title}</h3>
              <div className="entry-meta">
                <span className="entry-category">{entry.category || 'General'}</span>
                <small>{entry.createdAt?.toDate().toLocaleDateString()}</small>
              </div>
            </div>
            <p className="entry-content">{entry.content}</p>
            <div className="entry-actions">
              <button onClick={() => startEditing(entry)} className="edit-button">Edit</button>
              <button onClick={() => handleDeleteEntry(entry.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))
        ) : (
          <p>No entries found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default PrayerJournalPage;
