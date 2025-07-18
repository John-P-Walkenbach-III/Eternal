import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CoursePromo  from '../components/CoursePromo.jsx';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          {currentUser ? (
            <>
              <h1>Welcome back, {currentUser.displayName || currentUser.email}!</h1>
              <p className="subtitle">We're glad to have you here. Ready to continue your journey?</p>
            </>
          ) : (
            <>
              <h1>A Deeper Walk with the Word</h1>
              <p className="subtitle">Join our free interactive New Testament study course. Track your progress, take quizzes, and grow in your understanding of the scriptures.</p>
              
            </>
          )}
        </div>
      </section>

     
      <hr className="section-divider" />

      <CoursePromo />
      <section className="features-overview">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Explore the Scriptures</h3>
            <p>Look up any passage in the World English Bible with our reader.</p>
            <Link to="/bible-reader" className="feature-link">Go to Bible Reader</Link>
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
          {!currentUser && (
            <div className="feature-card">
              <h3>Interactive NT Course</h3>
              <p>Track your study progress, save your quiz scores, and pick up where you left off. All for free when you create an account.</p>
              <Link to="/login" className="feature-link">Create Your Account</Link>
            </div>
          )}
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
