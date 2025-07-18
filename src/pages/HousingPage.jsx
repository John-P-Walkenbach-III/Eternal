import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import StarRating from '../components/StarRating.jsx';
import InteractiveStarRating from '../components/InteractiveStarRating.jsx';
import { db } from '../firebase'; // Assuming your Firebase config is in firebase.js
import { collection, getDocs } from 'firebase/firestore';
import './ResourcePages.css'; // A new, shared stylesheet

function HousingPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "housingResources"));
        const fetchedResources = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(fetchedResources);
      } catch (err) {
        setError("Could not load resources. Please try again later.");
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // A helper function to ensure URLs are absolute for external links
  const ensureAbsoluteUrl = (url) => {
    if (!url) return '#'; // Return a safe fallback if URL is missing
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Filter resources based on the search term in name or description
  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resource-page-container">
      <div className="resource-page-header">
        <FaHome className="resource-page-icon" />
        <h1>Housing & Shelter Resources</h1>

        {loading && <p className="resource-page-subtitle">Loading resources...</p>}
        {error && <p className="resource-page-subtitle error">{error}</p>}
        {!loading && !error && (
          <p className="resource-page-subtitle">
            Connect with organizations that provide safe and stable housing options.
          </p>
        )}
        <p className="resource-page-subtitle">
          Below you will find some good resources for affordable housing, homeless shelters, and re-entry facilities. 
        </p>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="resource-search-bar"
        />
      </div>
      
      <div className="resource-list">
        {!loading && filteredResources.length === 0 && <p className="no-results-message">No resources found matching your search.</p>}
        {filteredResources.map((resource, index) => (
          <div key={resource.id} className="resource-list-item">
            <div className="resource-item-header">
              <h3>{resource.name}</h3>
              {resource.ratingCount > 0 && (
                <div className="rating-container">
                  <StarRating rating={resource.rating / resource.ratingCount} />
                  <span className="rating-text">({resource.ratingCount})</span>
                </div>
              )}
            </div>
            <p>{resource.description}</p>
            <div className="resource-contact">
              {resource.website && <a href={ensureAbsoluteUrl(resource.website)} target="_blank" rel="noopener noreferrer" className="resource-link">Visit Website</a>}
              {resource.phone && <span className="contact-separator"> | </span>}
              {resource.phone && <span>Phone: {resource.phone}</span>}
            </div>
            <div className="user-rating-section">
              <p>Your rating:</p>
              <InteractiveStarRating resourceId={resource.id} collectionName="housingResources" />
            </div>
          </div>
        ))}
      </div>

      <div className="resource-page-footer">
          <p>Need more direct help? Please reach out to us.</p>
          <Link to="/contact" className="cta-button">Contact Us</Link>
      </div>
    </div>
  );
}

export default HousingPage;