import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTestimonies } from '../hooks/useTestimonies';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import TestimonyItem from '../components/TestimonyItem.jsx';
import { FaPenNib, FaHeart, FaSpinner } from 'react-icons/fa';
import { GiMegaphone } from "react-icons/gi";
import './TestimonyPage.css';

const TestimonyPage = () => {
  const { currentUser } = useAuth();
  const { testimonies, loading, loadingMore, error, hasMore, totalCount, fetchNextPage, addTestimony } = useTestimonies();
  
  // State for the form
  const [story, setStory] = useState('');
  const [ageSaved, setAgeSaved] = useState('');
  const [isBaptized, setIsBaptized] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topTestimonies, setTopTestimonies] = useState([]);

  // Effect to fetch the most "Amen'd" testimonies
  useEffect(() => {
    const fetchTopTestimonies = async () => {
      try {
        const testimoniesRef = collection(db, 'testimonies');
        const q = query(testimoniesRef, orderBy('likeCount', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const top = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopTestimonies(top);
      } catch (error) {
        console.error("Error fetching top testimonies:", error);
      }
    };
    fetchTopTestimonies();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: 'Submitting...', type: 'loading' });

    try {
      const formData = {
        story,
        ageSaved: Number(ageSaved),
        isBaptized,
      };
      await addTestimony(formData);
      setFormStatus({ message: 'Thank you for sharing your story!', type: 'success' });
      // Reset form fields
      setStory('');
      setAgeSaved('');
      setIsBaptized(false);
      e.target.reset(); // Resets the file input
    } catch (err) {
      console.error(err);
      setFormStatus({ message: 'Failed to submit testimony. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="testimony-page">
      <div className="testimony-header">
        <h1><FaHeart color='red' /> Share Your Story</h1>
        <p>Read inspiring testimonies from our community and share your own journey of faith.</p>
      </div>

      {topTestimonies.length > 0 && (
        <div className="most-encouraged-section">
          <h2>Most Encouraged Stories</h2>
          <div className="top-testimonies-grid">
            {topTestimonies.map(testimony => (
              <div key={testimony.id} className="top-testimony-card">
                <p className="top-testimony-story">"{testimony.story.substring(0, 150)}..."</p>
                <span className="top-testimony-author">- {testimony.displayName}</span>
                <div className="top-testimony-amens"><FaHeart /> {testimony.likeCount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentUser && (
        <div className="testimony-form-section">
          <h2><FaPenNib color='blue' /> Write Your Testimony</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="story">How and why did you get saved?</label>
              <textarea
                id="story"
                rows="8"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Share the story of how God's grace changed your life..."
                required
              />
            </div>
            <div className="form-group-inline">
              <label htmlFor="ageSaved">How old were you when you got saved?</label>
              <input
                id="ageSaved"
                type="number"
                value={ageSaved}
                onChange={(e) => setAgeSaved(e.target.value)}
                required
              />
            </div>
            <div className="form-group-inline">
              <label>
                <input
                  type="checkbox"
                  checked={isBaptized}
                  onChange={(e) => setIsBaptized(e.target.checked)}
                />
                 Have you been baptized?
              </label>
            </div>
           
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sharing...' : 'Share My Testimony'}
            </button>
            {formStatus.message && <div className={`status-message ${formStatus.type}`}>{formStatus.message}</div>}
          </form>
        </div>
      )}

      <div className="testimonies-list">
        <h2><GiMegaphone size={90} color='black'/>Community Testimonies</h2>
        {totalCount !== 0 && <p className="story-count">Showing {testimonies.length} of {totalCount} stories</p>}
        {loading && <div className="loading-container"><FaSpinner className="spinner" /> Loading...</div>}
        {error && <div className="error-container">{error}</div>}
        {testimonies.map(testimony => (
          <TestimonyItem key={testimony.id} testimony={testimony} />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button onClick={fetchNextPage} disabled={loadingMore} className="load-more-button">
            {loadingMore ? 'Loading...' : 'Load More Testimonies'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonyPage;