import React from 'react'
import ContactForm from '../components/ContactForm.jsx'

function Contact() {
  return (
    <div className="contact-page">
      <h2>Get In Touch</h2>
      <p>
        You can reach out directly via email or use the form below to send a message or Prayer Request. I look forward to hearing from you!
      </p>
      <div className="contact-info">
        <strong>John Walkenbach III</strong><br />
        <a href="mailto:johnwalkenbach1@gmail.com">johnwalkenbach1@gmail.com</a>
      </div>
      <hr className="section-divider" />
      <ContactForm />
    </div>
  )
}

export default Contact
