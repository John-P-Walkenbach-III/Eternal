import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import './DevotionalManager.css';

const DevotionalManager = () => {
  const [devotionals, setDevotionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentDevotional, setCurrentDevotional] = useState({ date: '', title: '', content: '' });

  useEffect(() => {
    const q = query(collection(db, 'devotionals'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevotionals(items);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching devotionals:", err);
      setError("Failed to load devotionals.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDevotional(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentDevotional({ date: '', title: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentDevotional.date || !currentDevotional.title || !currentDevotional.content) {
      setError('Date, Title, and Content are required.');
      return;
    }
    setError('');

    if (isEditing) {
      const devotionalDoc = doc(db, 'devotionals', currentDevotional.id);
      await updateDoc(devotionalDoc, { ...currentDevotional });
    } else {
      await addDoc(collection(db, 'devotionals'), { ...currentDevotional });
    }
    resetForm();
  };

  const handleEdit = (devotional) => {
    setIsEditing(true);
    setCurrentDevotional(devotional);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this devotional?")) {
      await deleteDoc(doc(db, 'devotionals', id));
    }
  };

  return (
    <div className="devotional-manager">
      <h4>{isEditing ? 'Edit Devotional' : 'Add New Devotional'}</h4>
      <form onSubmit={handleSubmit}>
        <input type="date" name="date" value={currentDevotional.date} onChange={handleInputChange} required />
        <input type="text" name="title" value={currentDevotional.title} onChange={handleInputChange} placeholder="Title" required />
        <textarea name="content" value={currentDevotional.content} onChange={handleInputChange} placeholder="Content" rows="10" required />
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Update Devotional' : 'Add Devotional'}</button>
          {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      {error && <p className="status-message error">{error}</p>}

      <div className="devotional-list-container">
        {loading && <p>Loading devotionals...</p>}
        {devotionals.map(devotional => (
          <div key={devotional.id} className="devotional-item">
            <div className="devotional-info">
              <strong>{devotional.date}: {devotional.title}</strong>
              <p>{devotional.content.substring(0, 100)}...</p>
            </div>
            <div className="devotional-actions">
              <button onClick={() => handleEdit(devotional)}>Edit</button>
              <button onClick={() => handleDelete(devotional.id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevotionalManager;