import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaHome, FaBriefcase, FaUserFriends, FaCross } from 'react-icons/fa';
import './ReEntryPage.css';

const ReEntryPage = () => {
  return (
    <div className="re-entry-page">
      <div className="re-entry-header">
        <h1><FaHandHoldingHeart  size={90} color='blue'/> A New Beginning: Re-Entry & Recovery</h1>
        <p className="page-subtitle">Find hope, support, and practical resources for your journey forward. You are not alone.</p>
      </div>

      <div className="resources-section">
        <h2>Find Support</h2>
        <p>Whether you're transitioning from incarceration, recovering from addiction, or facing a major life challenge, here are resources to help you take the next step in faith.</p>
        <div className="resource-grid">
          <div className="resource-card">
            <FaHome className="resource-icon" />
            <h3>Housing & Shelter</h3>
            <p>Connect with organizations that provide safe and stable housing options.</p>
            <Link to="/re-entry/housing" className="resource-link">Learn More</Link>
          </div>
          <div className="resource-card">
            <FaBriefcase className="resource-icon" />
            <h3>Employment & Job Training</h3>
            <p>Find assistance with resume building, interview skills, and job placement services.</p>
            <Link to="/re-entry/employment" className="resource-link">Learn More</Link>
          </div>
          <div className="resource-card">
            <FaUserFriends className="resource-icon" />
            <h3>Counseling & Support Groups</h3>
            <p>Access professional counseling and connect with support groups that understand.</p>
            <Link to="/re-entry/counseling" className="resource-link">Learn More</Link>
          </div>
          <div className="resource-card">
            <FaCross className="resource-icon" />
            <h3>Spiritual Guidance</h3>
            <p>Strengthen your faith with dedicated Bible studies, mentorship, and prayer support.</p>
            <Link to="/re-entry/spiritual" className="resource-link">Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReEntryPage;