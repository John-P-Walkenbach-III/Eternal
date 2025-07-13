import React, { useState } from 'react';
import { db } from '../firebase'; // We need the db instance from our firebase config
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function ContactForm() {
    // State for form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // State for submission status
    const [status, setStatus] = useState({
        submitting: false,
        success: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, success: false, error: null });

        try {
            // 'messages' is the name of the collection in Firestore
            await addDoc(collection(db, "messages"), {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                createdAt: serverTimestamp() // Adds a server-side timestamp
            });
            setStatus({ submitting: false, success: true, error: null });
            setFormData({ name: '', email: '', message: '' }); // Clear form on success
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus({ submitting: false, success: false, error: "Failed to send message. Please try again." });
        }
    };

    return (
        <div className="contact-form-container">
            <h3>Contact Us</h3>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder='Enter your name' value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder='Enter your email' value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-grop">
                    <label htmlFor="message">Message/Prayer Request</label>
                    <textarea id="message" name="message" placeholder='Enter your message or prayer request' value={formData.message} onChange={handleChange} rows="5" required></textarea>
                </div>
                <button type="submit" disabled={status.submitting}>
                    {status.submitting ? 'Sending...' : 'Send Message/Prayer'}
                </button>
            </form>
            {status.success && <p className="status-message success">Message sent successfully!</p>}
            {status.error && <p className="status-message error">{status.error}</p>}
        </div>
    );
}

export default ContactForm;