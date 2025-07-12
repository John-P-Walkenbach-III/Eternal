// We can import React if we want, but it's not strictly necessary with modern JSX transform
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Features from './pages/Features.jsx';
import Contact from './pages/Contact.jsx';
import Pictures from './pages/Pictures.jsx';
import BibleStudy from './pages/BibleStudy.jsx';

function App() {
  return (
    // React Fragments (<> ... </>) let us return multiple elements
    <>
      <header className="site-header">
        <div className="logo-container">
            {/* The path to images in the `public` folder is relative to the root */}
            <img src="/images/elm2.png" alt="Eternal Logo" className="logo" />
            <h1>Eternal Life Ministry</h1>
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
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pictures" element={<Pictures />} />
          <Route path="/study" element={<BibleStudy />} />
        </Routes>
      </main>

      <footer>
          <p>&copy; 2024 Eternal Life Ministry. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
