import React, { useState } from 'react'; // Import useState
import { useAuth } from '../auth/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignInPage.css';

function SignInPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSigningIn, setIsSigningIn] = useState(false); // NEW: State to track login progress

    // Get the page the user was trying to access before being redirected
    const from = location.state?.from?.pathname || "/";

    const handleSignIn = async () => {
        // Don't do anything if a sign-in is already in progress
        if (isSigningIn) {
            return;
        }

        setIsSigningIn(true); // Disable the button
        
        try {
            const result = await login();
            if (result && !result.error) {
                if (result.isNewUser) {
                    // If the user is new, send them to complete their profile
                    navigate("/complete-profile", { replace: true });
                } else {
                    // Otherwise, send them to their original destination
                    navigate(from, { replace: true });
                }
            } else {
                // Handle login error (e.g., show a message)
                alert("Sign in failed. Please make sure you are using a valid @wisc.edu account. Error: " + result.message);
            }
        } finally {
            setIsSigningIn(false); // Re-enable the button whether it succeeded or failed
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-box">
                <h1>Sign In</h1>
                <p>To post a review, please sign in with your UW-Madison Microsoft account.</p>
                <button 
                    onClick={handleSignIn} 
                    className="microsoft-signin-button"
                    disabled={isSigningIn} // NEW: Disable button when signing in
                >
                    {isSigningIn ? 'Signing in...' : 'Sign in with Microsoft'}
                </button>
                <p className="privacy-note">
                    We use your @wisc.edu email to verify your student status.
                </p>
            </div>
        </div>
    );
}

export default SignInPage;