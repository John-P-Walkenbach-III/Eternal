import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc, updateDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import './PrayerJournalPage.css';
import { FaBookMedical, FaTrash } from 'react-icons/fa';

function PrayerJournalPage() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState(null);

  // Fetch entries in real-time
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const journalCollectionRef = collection(db, 'users', currentUser.uid, 'journalEntries');
    const q = query(journalCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to a readable date
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString()
      }));
      setEntries(fetchedEntries);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching journal entries:", err);
      setError("Failed to load journal entries. Please try again.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]);

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!currentUser || !newEntry.trim()) {
      return;
    }

    try {
      const journalCollectionRef = collection(db, 'users', currentUser.uid, 'journalEntries');
      await addDoc(journalCollectionRef, {
        content: newEntry,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      });
      setNewEntry(''); // Clear the textarea after saving
    } catch (error) {
      console.error("Error saving journal entry: ", error);
      setError("Failed to save entry. Please check your connection and try again.");
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to delete this entry?")) {
        try {
            const entryRef = doc(db, 'users', currentUser.uid, 'journalEntries', entryId);
            await deleteDoc(entryRef);
        } catch (error) {
            console.error("Error deleting entry:", error);
            setError("Failed to delete entry. Please try again.");
        }
    }
  };

  const startEditing = (entry) => {
    setEditingId(entry.id);
    setEditedContent(entry.content);
  };

  const handleEditChange = (e) => {
    setEditedContent(e.target.value);
  };

  const saveEdit = async (entryId) => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'journalEntries', entryId), { content: editedContent });
      setEditingId(null);
    } catch (error) {
      setError("Failed to update entry. Please try again.");
    }
  };

  return (
    <div className="journal-page">
      <header className="journal-header">
        <h1><FaBookMedical /> My Prayer Journal</h1>
        <p>A private space to record your prayers, thoughts, and God's answers.</p>
      </header>
      
      <section className="journal-form-section">
        <form onSubmit={handleSaveEntry}>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What's on your heart today?"
            rows="6"
            required
          />
          <button type="submit" disabled={!newEntry.trim()}>Save Entry</button>
        </form>
      </section>

      <section className="journal-entries-section">
        <h2>Past Entries</h2>
        {loading && <p>Loading your journal...</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && entries.length === 0 && (
          <p>You have no journal entries yet. Write one above to get started!</p>
        )}
        <div className="entries-list">
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card" style={{ position: 'relative' }}>
              {editingId === entry.id ? (
                <textarea
                  value={editedContent}
                  onChange={handleEditChange}
                  className="edit-textarea"
                />
              ) : (
                <p className="entry-content">{entry.content}</p>
              )}
              <div className="entry-actions">
                <span className="entry-date">{entry.createdAt}</span>
                {editingId === entry.id ? (
                  <button
                    onClick={() => saveEdit(entry.id)}
                    className="edit-button save"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(entry)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => handleDeleteEntry(entry.id)} className="delete-button" title="Delete entry">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PrayerJournalPage;