import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useNavigate } from 'react-router-dom';
import './CompleteProfilePage.css';

function CompleteProfilePage() {
    const { token, completeLogin } = useAuth();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/complete-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile.');
            }

            const authData = await response.json();
            completeLogin(authData); // Update the auth context with the new user info
            navigate('/'); // Redirect to homepage

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="complete-profile-container">
            <div className="complete-profile-box">
                <h1>Welcome to Mad Abroad!</h1>
                <p>One last step. Please enter the name you'd like to display on your reviews.</p>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="name-input">Display Name</label>
                        <input
                            id="name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Bucky Badger"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Save and Continue</button>
                </form>
            </div>
        </div>
    );
}

export default CompleteProfilePage;