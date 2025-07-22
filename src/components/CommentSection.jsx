import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  runTransaction
} from 'firebase/firestore';
import './CommentSection.css';

const CommentSection = ({ docId, collectionName }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Admin check
  const isAdmin = currentUser && currentUser.uid === 'NTTcLOW3mGVko5K0BhOciM4eEYw2';

  useEffect(() => {
    if (!docId) return;

    const commentsRef = collection(db, collectionName, docId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'Just now'
      }));
      setComments(fetchedComments);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [docId, collectionName]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    const discussionDocRef = doc(db, collectionName, docId);
    const commentsRef = collection(discussionDocRef, 'comments');

    try {
      // Use a transaction to ensure the parent document exists before adding a comment
      await runTransaction(db, async (transaction) => {
        const discussionDoc = await transaction.get(discussionDocRef);
        if (!discussionDoc.exists()) {
          // Create the parent document if it doesn't exist
          transaction.set(discussionDocRef, {
            createdAt: serverTimestamp(),
          });
        }

        // Now add the new comment document to the subcollection
        const newCommentRef = doc(commentsRef);
        transaction.set(newCommentRef, {
          text: newComment,
          userId: currentUser.uid,
          displayName: currentUser.displayName || currentUser.email,
          createdAt: serverTimestamp()
        });
      });
      setNewComment('');
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Could not post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this comment?")) {
        const commentRef = doc(db, collectionName, docId, 'comments', commentId);
        await deleteDoc(commentRef);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            rows="3"
            required
          />
          <button type="submit" disabled={!newComment.trim() || isSubmitting}>{isSubmitting ? 'Posting...' : 'Post Comment'}</button>
        </form>
      ) : (
        <p>Please log in to leave a comment.</p>
      )}

      {error && <p className="status-message error">{error}</p>}
      
      <div className="comments-list">
        {loading && <p>Loading comments...</p>}
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <strong>{comment.displayName}</strong>
              <span className="comment-date">{comment.createdAt}</span>
            </div>
            <p className="comment-text">{comment.text}</p>
            {isAdmin && (
                <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment-btn">Delete</button>
            )}
          </div>
        ))}
        {!loading && comments.length === 0 && <p>No comments yet. Be the first!</p>}
      </div>
    </div>
  );
};

export default CommentSection;