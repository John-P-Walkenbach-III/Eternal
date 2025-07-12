import React from 'react'
import { Link } from 'react-router-dom';
import DailyVerse from '../components/DailyVerse.jsx';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Eternal Life Ministry</h1>
          <p className="subtitle">Gaining Faith in Jesus Christ, Together.</p>
          <Link to="/about" className="cta-button">Learn More About Our Mission</Link>
        </div>
      </section>

      <DailyVerse />
      <hr className="section-divider" />

      <section className="features-overview">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Explore the Scriptures</h3>
            <p>Use our integrated NKJV Bible reader to study the Word of God anytime.</p>
            <Link to="/features" className="feature-link">Go to Bible Reader</Link>
          </div>
          <div className="feature-card">
            <h3>Inspiring Messages</h3>
            <p>Watch sermons and worship from trusted Christian channels and speakers.</p>
            <Link to="/features" className="feature-link">Watch Videos</Link>
          </div>
          <div className="feature-card">
            <h3>Inspiring Pictures</h3>
            <p>Browse My Personal Christian Pictures Library.</p>
            <Link to="/pictures" className="feature-link">Browse Library</Link>
          </div>
          <div className="feature-card">
            <h3>Bible Study</h3>
            <p>Deepen your understanding of the scriptures with guided lessons and quizzes.</p>
            <Link to="/study" className="feature-link">Start Studying</Link>
          </div>
          <div className="feature-card">
            <h3>Get In Touch</h3>
            <p>Have a question or a prayer request? We would love to hear from you.</p>
            <Link to="/contact" className="feature-link">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
