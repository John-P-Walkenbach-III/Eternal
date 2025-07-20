import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import PrayerRequestItem from '../components/PrayerRequestItem';
import './PrayerWallPage.css';

const PrayerWallPage = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRequest, setNewRequest] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topRequests, setTopRequests] = useState([]);

  useEffect(() => {
    const requestsRef = collection(db, 'prayerRequests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(fetchedRequests);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching prayer requests:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Effect to fetch the most prayed-for requests
  useEffect(() => {
    const fetchTopRequests = async () => {
      try {
        const requestsRef = collection(db, 'prayerRequests');
        const q = query(requestsRef, orderBy('prayCount', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const top = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopRequests(top);
      } catch (error) {
        console.error("Error fetching top prayer requests:", error);
      }
    };
    fetchTopRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRequest.trim() === '' || !currentUser) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'prayerRequests'), {
        userId: currentUser.uid,
        displayName: isAnonymous ? 'Anonymous' : currentUser.displayName,
        requestText: newRequest,
        prayCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewRequest('');
      setIsAnonymous(false);
    } catch (error) {
      console.error("Error submitting prayer request:", error);
      alert("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="prayer-wall-container"><p>Loading prayer wall...</p></div>;
  }

  return (
    <div className="prayer-wall-container">
      <h1>Prayer Wall</h1>
      <p className="subtitle">Share your requests and lift up others in prayer.</p>

      {topRequests.length > 0 && (
        <div className="most-prayed-for-section">
          <h2>Community Prayers</h2>
          <div className="top-requests-grid">
            {topRequests.map(request => (
              <div key={request.id} className="top-request-card">
                <p className="top-request-text">"{request.requestText.substring(0, 120)}..."</p>
                <span className="top-request-author">- {request.displayName}</span>
                <div className="top-request-prayers"><FaPrayingHands /> {request.prayCount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="prayer-form">
        <textarea
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          placeholder="What can we pray for you today?"
          rows="4"
          required
        />
        <div className="form-footer">
          <label><input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} /> Post Anonymously</label>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
        </div>
      </form>

      <div className="requests-list">
        {requests.map(request => <PrayerRequestItem key={request.id} request={request} />)}
      </div>
    </div>
  );
};

export default PrayerWallPage;