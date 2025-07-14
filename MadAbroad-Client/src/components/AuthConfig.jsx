import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./auth/authConfig";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { instance } = useMsal();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('app_token');
        const storedUser = localStorage.getItem('app_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async () => {
        try {
            const response = await instance.loginPopup(loginRequest);
            const idToken = response.idToken;

            // Send token to our backend
            const backendResponse = await fetch('http://localhost:8080/api/auth/microsoft-signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            });

            if (!backendResponse.ok) {
                const errorText = await backendResponse.text();
                throw new Error(`Backend login failed: ${errorText}`);
            }

            const authData = await backendResponse.json();
            
            // Store our app's token and user info
            localStorage.setItem('app_token', authData.token);
            const userData = { name: authData.name, email: authData.email };
            localStorage.setItem('app_user', JSON.stringify(userData));
            
            setToken(authData.token);
            setUser(userData);

            return { isNewUser: authData.isNewUser };

        } catch (error) {
            console.error("Login failed:", error);
            // Clear any partial login artifacts
            localStorage.removeItem('app_token');
            localStorage.removeItem('app_user');
            setUser(null);
            setToken(null);
            return { error: true, message: error.message };
        }
    };

    const completeLogin = (authData) => {
        localStorage.setItem('app_token', authData.token);
        const userData = { name: authData.name, email: authData.email };
        localStorage.setItem('app_user', JSON.stringify(userData));
        setToken(authData.token);
        setUser(userData);
    };

    const handleLogout = () => {
        instance.logoutPopup({ postLogoutRedirectUri: "/" });
        localStorage.removeItem('app_token');
        localStorage.removeItem('app_user');
        setUser(null);
        setToken(null);
    };

    const authValue = {
        user,
        token,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        completeLogin
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);