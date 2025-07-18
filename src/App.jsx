// We can import React if we want, but it's not strictly necessary with modern JSX transform
import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Features from './pages/Features.jsx';
import Contact from './pages/Contact.jsx';
import Pictures from './pages/Pictures.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { getDisplayName } from './utils/helpers.jsx';
import SignUp from './pages/SignUp.jsx';
import TestimonyPage from './pages/TestimonyPage.jsx';
import HousingPage from './pages/HousingPage.jsx';
import CounselingPage from './pages/CounselingPage.jsx';
import SpiritualPage from './pages/SpiritualPage.jsx'; // Placeholder
import EmploymentPage from './pages/EmploymentPage.jsx';
import ReEntryPage from './pages/ReEntryPage.jsx';




function App() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Replace 'YOUR_USER_ID_HERE' with your actual Firebase User ID
  // For example: const isAdmin = currentUser && currentUser.uid === 'qR7pL2vgY3tF9o1abc...';
  const isAdmin = currentUser && currentUser.uid === 'NTTcLOW3mGVko5K0BhOciM4eEYw2';

  const handleLogout = async () => {
    try {
      await logout();
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
                <li><NavLink to="/testimonies">Testimonies</NavLink></li>
                <li><NavLink to="/re-entry">Re-Entry</NavLink></li>
                <li><NavLink to="/pictures">Pictures</NavLink></li>
                {currentUser && (
                  <>
                    
                  </>
                )}
            </ul>
        </nav>
       
      
     
       
        
        <div className="auth-controls">
          {currentUser ? (
            <>
              <span className="user-greeting">Hello, {getDisplayName(currentUser)}</span>
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
          <Route path="/testimonies" element={<TestimonyPage />} />
          <Route path="/re-entry/employment" element={<EmploymentPage />} />
          <Route path="/re-entry/housing" element={<HousingPage />} />
          <Route path="/re-entry/counseling" element={<CounselingPage />} />
          <Route path="/re-entry/spiritual" element={<SpiritualPage />} />
          <Route path="/re-entry" element={<ReEntryPage />} />
          <Route path="/pictures" element={<Pictures />} />
         
         


          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>

      <footer>
          <p>&copy; {new Date().getFullYear()} Eternal Life Ministry. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
