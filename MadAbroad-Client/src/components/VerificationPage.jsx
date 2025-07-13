import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function VerificationPage() {
    const location = useLocation();

    // Check which path we are on to display the correct message
    const isSuccess = location.pathname === '/thank-you';

    return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', lineHeight: '1.6' }}>
            {isSuccess ? (
                <>
                    <h1 style={{ color: '#28a745' }}>Thank You!</h1>
                    <p style={{ fontSize: '1.2rem' }}>Your review has been successfully published.</p>
                </>
            ) : (
                <>
                    <h1 style={{ color: '#c5050c' }}>Verification Failed</h1>
                    <p style={{ fontSize: '1.2rem' }}>The verification link may be invalid or has expired. Please try submitting your review again.</p>
                </>
            )}
            <br />
            <Link to="/" style={{ fontSize: '1.1rem', color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
                Return to Homepage
            </Link>
        </div>
    );
}

export default VerificationPage;