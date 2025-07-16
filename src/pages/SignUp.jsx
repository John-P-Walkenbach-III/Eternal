import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignUp.css';

const SignUp = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }

        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, displayName);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            // Provide more specific Firebase error messages
            if (err.code === 'auth/email-already-in-use') {
                setError('This email address is already in use.');
            } else {
                setError('Failed to create an account. Please try again.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Your Account</h2>
                <p className="subheading">Join to start your free Bible study course.</p>
                {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="display-name">Display Name</label>
                        <input id="display-name" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password (6+ characters)</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-confirm">Confirm Password</label>
                        <input id="password-confirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
                    </div>
                    <button disabled={loading} className="auth-button" type="submit">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
            </form>
                <div className="auth-switch">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;