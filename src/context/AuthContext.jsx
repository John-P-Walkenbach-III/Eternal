// Example for: src/context/AuthContext.jsx

import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust path if needed
import { 
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // After creating the user, update their profile with the display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    // The onAuthStateChanged listener will pick up the new user automatically.
    // We return the userCredential for any further actions if needed.
    return userCredential;
  }

  function logout() {
    return signOut(auth);
  }

  function passwordReset(email) {
    return sendPasswordResetEmail(auth, email)
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    passwordReset,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
