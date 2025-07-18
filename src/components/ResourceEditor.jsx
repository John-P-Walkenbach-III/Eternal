import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import './ResourceEditor.css';

const ResourceEditor = ({ collectionName, title }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentResource, setCurrentResource] = useState({ name: '', description: '', website: '', phone: '' });

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResources(items);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(`Failed to load ${title}.`);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [collectionName, title]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentResource({ name: '', description: '', website: '', phone: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentResource.name || !currentResource.description) {
      setError('Name and Description are required.');
      return;
    }
    setError('');

    if (isEditing) {
      // Update existing resource
      const resourceDoc = doc(db, collectionName, currentResource.id);
      await updateDoc(resourceDoc, { ...currentResource });
    } else {
      // Add new resource
      await addDoc(collection(db, collectionName), {
        ...currentResource,
        createdAt: serverTimestamp()
      });
    }
    resetForm();
  };

  const handleEdit = (resource) => {
    setIsEditing(true);
    setCurrentResource(resource);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this resource?`)) {
      const resourceDoc = doc(db, collectionName, id);
      await deleteDoc(resourceDoc);
    }
  };

  return (
    <div className="resource-editor">
      <h3>{title}</h3>
      <div className="editor-form-container">
        <h4>{isEditing ? 'Edit Resource' : 'Add New Resource'}</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={currentResource.name} onChange={handleInputChange} placeholder="Name" required />
          <textarea name="description" value={currentResource.description} onChange={handleInputChange} placeholder="Description" required />
          <input type="text" name="website" value={currentResource.website} onChange={handleInputChange} placeholder="Website URL" />
          <input type="text" name="phone" value={currentResource.phone} onChange={handleInputChange} placeholder="Phone Number" />
          <div className="form-actions">
            <button type="submit">{isEditing ? 'Update Resource' : 'Add Resource'}</button>
            {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
        {error && <p className="status-message error">{error}</p>}
      </div>

      <div className="resource-list-container">
        {loading && <p>Loading resources...</p>}
        {resources.map(resource => (
          <div key={resource.id} className="resource-item">
            <div className="resource-info">
              <strong>{resource.name}</strong>
              <p>{resource.description}</p>
            </div>
            <div className="resource-actions">
              <button onClick={() => handleEdit(resource)}>Edit</button>
              <button onClick={() => handleDelete(resource.id)} className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceEditor;