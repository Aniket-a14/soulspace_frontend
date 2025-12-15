"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in on mount
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/user/profile');
                    setUser(response.data);
                } catch (error) {
                    // If 401/403, token is invalid, just clear it and don't log scary error
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        localStorage.removeItem('token');
                    } else {
                        console.error("Failed to fetch user:", error);
                    }
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        router.push('/');
    };

    const signup = async (email, password) => {
        const response = await api.post('/auth/signup', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
