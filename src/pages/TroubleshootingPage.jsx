import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './TroubleshootingPage.css';

const TroubleshootingPage = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const form = useRef();

  const [issueType, setIssueType] = useState('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          addNotification('Thank you! Your report has been sent.', 'success');
          // Reset form
          setIssueType('general');
          setMessage('');
      }, (error) => {
          console.error("EmailJS Error:", error.text);
          addNotification('Sorry, there was an error sending your report.', 'error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="troubleshooting-container">
      <div className="troubleshooting-card">
        <h1>Report an Issue</h1>
        <p className="subtitle">
          Encountered a problem? Please let us know! Your feedback helps us improve the site for everyone.
        </p>
        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            <label htmlFor="user_email">Your Email Address</label>
            <input
              type="email"
              name="user_email"
              id="user_email"
              defaultValue={currentUser?.email || ''}
              required
              readOnly={!!currentUser}
            />
            {currentUser && <small>This is pre-filled from your account.</small>}
          </div>

          <div className="form-group">
            <label htmlFor="issue_type">What kind of issue are you seeing?</label>
            <select
              name="issue_type"
              id="issue_type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="general">General Issue / Question</option>
              <option value="login">Login or Account Problem</option>
              <option value="quizzes">Quiz or Bible Study Problem</option>
              <option value="achievements">Achievement Not Unlocking</option>
              <option value="display">Display or Layout Error</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Please describe the issue in detail:</label>
            <textarea
              name="message"
              id="message"
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="For example: 'When I click the 'Like' button on the daily verse, nothing happens.'"
            ></textarea>
          </div>

          <button type="submit" className="cta-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TroubleshootingPage;