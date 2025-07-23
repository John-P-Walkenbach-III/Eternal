import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (displayName.trim() === '') {
      setMessage('Display Name cannot be empty.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      await updateUserProfile({ displayName });
      setMessage('Profile updated successfully!');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard'), 1500); // Redirect after a short delay
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage('Failed to update profile. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <h2>Edit Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" value={currentUser?.email || ''} disabled />
            <small>Email address cannot be changed.</small>
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <p className={`status-message ${messageType}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
