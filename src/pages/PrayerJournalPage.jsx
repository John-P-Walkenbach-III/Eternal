import React, { useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import { FaBookMedical, FaTrash, FaSpinner } from 'react-icons/fa';
import './PrayerJournalPage.css';

const PrayerJournalPage = () => {
  const { entries, loading, error, addJournalEntry, deleteJournalEntry } = useJournal();
  const [newEntry, setNewEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newEntry.trim() === '') return;

    setIsSubmitting(true);
    try {
      await addJournalEntry(newEntry);
      setNewEntry('');
    } catch (err) {
      console.error("Failed to add entry:", err);
      // Optionally set an error state to show in the UI
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-page">
      <div className="journal-header">
        <h1><FaBookMedical /> My Prayer Journal</h1>
        <p>A private and secure space for your personal reflections and prayers.</p>
      </div>

      <div className="journal-entry-form">
        <form onSubmit={handleSubmit}>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Write your prayer or reflection here..."
            rows="5"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>

      <div className="journal-entries-list">
        <h2>Past Entries</h2>
        {loading && <div className="journal-loading"><FaSpinner className="spinner"/> Loading entries...</div>}
        {error && <div className="journal-error">{error}</div>}
        {!loading && entries.length === 0 && <p className="no-entries">You have no journal entries yet.</p>}
        {entries.map(entry => (
          <div key={entry.id} className="journal-entry-card">
            <p className="entry-content">{entry.content}</p>
            <div className="entry-meta">
              <span>{new Date(entry.createdAt.seconds * 1000).toLocaleString()}</span>
              <button onClick={() => deleteJournalEntry(entry.id)} className="delete-button"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerJournalPage;