// We can import React if we want, but it's not strictly necessary with modern JSX transform
import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Features from './pages/Features.jsx';
import Contact from './pages/Contact.jsx';
import Pictures from './pages/Pictures.jsx';
import BibleStudy from './pages/BibleStudy.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { auth } from './firebase.js';

function App() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    // React Fragments (<> ... </>) let us return multiple elements
    <>
      <header className="site-header">
        <div className="logo-container">
            {/* The path to images in the `public` folder is relative to the root */}
            <img src="/images/elm2.png" alt="Eternal Logo" className="logo" />
        </div>
        <nav>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/features">Features</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/contact">Contact</NavLink></li>
                <li><NavLink to="/pictures">Pictures</NavLink></li>
                <li><NavLink to="/study">Bible Study</NavLink></li>
            </ul>
        </nav>
        <div className="auth-controls">
          {currentUser ? (
            <>
              <span className="user-greeting">Hello, {currentUser.displayName || currentUser.email}</span>
              <button onClick={handleLogout} className="auth-button">Log Out</button>
            </>
          ) : (
            <NavLink to="/login" className="auth-button">Log In / Sign Up</NavLink>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pictures" element={<Pictures />} />
          <Route
            path="/study"
            element={
              <ProtectedRoute>
                <BibleStudy />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </main>

      <footer>
          <p>&copy; 2024 Eternal Life Ministry. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
