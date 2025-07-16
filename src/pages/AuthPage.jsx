import React, { useState } from "react"
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"

import { auth, db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (isSignUp) {
        if (!displayName) {
          setError("Please enter a display name.")
          return
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const user = userCredential.user
        await updateProfile(user, { displayName })

        // Create the user's progress document in Firestore
        const progressDocRef = doc(db, "user_progress", user.uid)
        await setDoc(progressDocRef, {
          displayName: displayName,
          email: user.email,
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate("/") // Redirect to home page after successful login/signup
    } catch (err) {
      setError(err.message)
    }
  }

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError('');
    } catch (err) {
      setError(`Failed to send reset email: ${err.message}`);
      console.error("Forgot password error", err);
    }
  };



  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6+ characters"
              required
            />
          </div>
          <button type="submit" className="cta-button">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>

          {!isSignUp && (
            <>
              <button type="button" onClick={handleForgotPassword} className="forgot-password-button">
                Forgot Password?
              </button>

              {resetEmailSent && (
                <p className="success-message">Password reset email sent! Check your inbox.</p>
              )}
            </>
          )}
          {error && <p className="status-message error">{error}</p>}
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="toggle-auth-mode"
        >
          {isSignUp
            ? "Already have an account? Log In"
            : "Need an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage
