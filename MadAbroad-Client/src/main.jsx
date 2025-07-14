import React from 'react';
import { createRoot } from 'react-dom/client';
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './auth/authConfig';
import { AuthProvider } from './auth/AuthContext';
import './index.css';
import App from './App.jsx';

// Create an MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MsalProvider>
  </React.StrictMode>
);