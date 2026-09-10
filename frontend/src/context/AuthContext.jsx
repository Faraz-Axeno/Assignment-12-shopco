import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/profile`);
                setUser(data);
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/login`, { email, password });
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users`, { name, email, password });
        setUser(data);
        return data;
    };

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/logout`);
        } catch (error) {
            console.error('Logout failed', error);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
