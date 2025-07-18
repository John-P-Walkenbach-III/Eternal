import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaBook, FaPencilAlt, FaChartBar } from 'react-icons/fa';
import { FaPersonPraying } from "react-icons/fa6";
import './CoursePromo.css';

const CoursePromo = () => {
  return (
    <section className="course-promo-section">
      <div className="promo-container">
        <h2><FaPersonPraying size={120} color='black' />Deepen Your Faith with Our Free Bible Reader</h2>
       

        <h3>How It Works</h3>
        <div className="how-it-works-grid">
          <div className="step-card">
            <FaUserPlus color='gray' className="step-icon" />
            <h4>1. Sign Up for Free</h4>
            <p>Create a free account  No hidden costs, just a path to deeper knowledge.</p>
          </div>
          <div className="step-card">
            <FaBook color='brown' className="step-icon" />
            <h4>2. Read & Study With Our Bible Reader On The Features Page.</h4>
          </div>
          
          
        </div>

        <Link to="/signup" className="promo-cta-button">
          Start Your Free Membership Today! There is absolutely No Charges To You, This Site And All Of It's Contents Are 100% FREE!
        </Link>
      </div>
    </section>
  );
};

export default CoursePromo;