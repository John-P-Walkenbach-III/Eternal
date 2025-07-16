import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaBook, FaPencilAlt, FaChartBar } from 'react-icons/fa';
import './CoursePromo.css';

const CoursePromo = () => {
  return (
    <section className="course-promo-section">
      <div className="promo-container">
        <h2>Deepen Your Faith with Our Free Bible Study Course</h2>
        <p className="promo-intro">
          Embark on a guided journey through the New Testament. Our interactive course is designed to enrich your understanding and strengthen your connection to the scriptures, all at your own pace.
        </p>

        <h3>How It Works</h3>
        <div className="how-it-works-grid">
          <div className="step-card">
            <FaUserPlus className="step-icon" />
            <h4>1. Sign Up for Free</h4>
            <p>Create a free account to unlock the full course and save your progress. No hidden costs, just a path to deeper knowledge.</p>
          </div>
          <div className="step-card">
            <FaBook className="step-icon" />
            <h4>2. Read & Study</h4>
            <p>Each lesson is paired with text from our "Bible Reader". The quizzes are based directly on this text, so you'll have everything you need.</p>
          </div>
          <div className="step-card">
            <FaPencilAlt className="step-icon" />
            <h4>3. Take Quizzes & Save Scores</h4>
            <p>After each lesson, take the quiz. You're on the honor system! Find your score at the top of the quiz and enter it to record your achievement.</p>
          </div>
          <div className="step-card">
            <FaChartBar className="step-icon" />
            <h4>4. Track Your Progress</h4>
            <p>Your personal dashboard will display your progress, lesson by lesson, keeping you motivated as you advance through the New Testament.</p>
          </div>
        </div>

        <Link to="/signup" className="promo-cta-button">
          Start Your Free Study Today
        </Link>
      </div>
    </section>
  );
};

export default CoursePromo;