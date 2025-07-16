import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Assuming your Firebase config is set up in firebase.js
import { collection, query, where, getDocs, orderBy, doc, updateDoc, arrayUnion, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useAnnotations = (passageReference) => {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!passageReference) {
      setLoading(false);
      return;
    }

    const fetchAnnotations = async () => {
      setLoading(true);
      try {
        const annotationsQuery = query(
          collection(db, 'annotations'),
          where('passageReference', '==', passageReference),
          orderBy('createdAt', 'desc') // Or any other relevant ordering
        );
        const querySnapshot = await getDocs(annotationsQuery);
        const fetchedAnnotations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnotations(fetchedAnnotations);
      } catch (error) {
        console.error("Error fetching annotations:", error);
        // Handle error appropriately, e.g., set an error state
      } finally {
        setLoading(false);
      }
    };

    fetchAnnotations();
  }, [passageReference]);

  const upvoteAnnotation = async (annotationId) => {
    if (!currentUser) {
      // Handle case where user is not logged in, maybe show a message
      return;
    }

    try {
      const annotationDoc = await doc(db, 'annotations', annotationId);
      const annotationSnapshot = await getDoc(annotationDoc);

      if (annotationSnapshot.exists()) {
          const currentUpvotes = annotationSnapshot.data().upvotes || [];
          const userIndex = currentUpvotes.indexOf(currentUser.uid);

          let newUpvotes = [...currentUpvotes];
          if (userIndex === -1) {
            newUpvotes.push(currentUser.uid); // Add upvote
          } else {
            newUpvotes.splice(userIndex, 1); // Remove upvote
          }

          await updateDoc(annotationDoc, { upvotes: newUpvotes });

      // Optimistically update the local state
      setAnnotations(prevAnnotations =>
        prevAnnotations.map(anno =>
          anno.id === annotationId ? { ...anno, upvotes: newUpvotes } : anno)
        );
    } catch (error) {
      console.error("Error upvoting annotation:", error);
      // Handle error, maybe show a message or revert the local state change
    }
  };

  const addAnnotation = async (selectedText, comment) => {
    if (!currentUser) return;

    if (!passageReference || !selectedText || !comment) {
      // Handle invalid inputs, maybe throw an error or return
      console.error("Invalid inputs for addAnnotation");
      return;
    }

    try {
      const newAnnotation = {
        passageReference,
        userDisplayName: currentUser.displayName || currentUser.email, // Or however you store user names
        selectedText,
        comment,
        upvotes: [], // Initialize with no upvotes
        createdAt: new Date(),
        userId: currentUser.uid,
      };

      const docRef = await addDoc(collection(db, 'annotations'), newAnnotation);
      const annotationId = docRef.id;

      // Optimistically update the local state
      setAnnotations(prevAnnotations => [...prevAnnotations, { id: annotationId, ...newAnnotation }]);
    } catch (err) {
      console.error("Error adding annotation:", err);
    }
  };

  return {
    annotations,
    loading,
    upvoteAnnotation,
    addAnnotation
  };
}