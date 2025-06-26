// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authService  from '../services/authservice';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check authentication on app start (with localStorage)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = localStorage.getItem("user");
                const isLoggedIn = localStorage.getItem("isLoggedIn");

                if (userData) {
                    setUser(JSON.parse(userData));
                } else if (isLoggedIn) {
                    const response = await api.get("/auth/current-user", { withCredentials: true });
                    if (response.data?.data?.userobject) {
                        setUser(response.data.data.userobject);
                    }
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Backend warmup effect
    useEffect(() => {
        const warmup = async () => {
            const hasPinged = sessionStorage.getItem("pinged");
            if (!hasPinged) {
                try {
                    await api.get("/ping");
                    sessionStorage.setItem("pinged", "true");
                } catch (err) {
                    // Backend still sleeping...
                }
            }
        };
        warmup();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            if (!response || !response.data) {
                throw new Error("Invalid response from the server");
            }
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("isLoggedIn", "true");
            setUser(response.data);
            toast.success('Welcome back!');
            navigate("/");
        } catch (error) {
            toast.error(error.message || 'Login failed. Please try again.');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (!response || !response.data) {
                throw new Error("Invalid response from the server");
            }
            const token = response.data.token;
            const userObj = response.data.userobject;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userObj));
            localStorage.setItem("isLoggedIn", "true");
            setUser(response.data.user);
            const welcomeMessage = userData.role === 'hotel_lister' 
            ? 'Welcome to Wanderlust as a Hotel Lister!' 
            : 'Welcome to Wanderlust!';
        toast.success(welcomeMessage);
           navigate("/");
        } catch (error) {
            const errorMessage = error?.message || error?.response?.data?.message || "Signup failed. Please try again.";
    
            // Show error message in toast
            toast.error(errorMessage);
    
            throw error;
        }
    };
    

    const logout = async () => {
        try {
            const response = await authService.logout();
            if (response.status === 200) {
                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");
                setUser(null);
                toast.success('Logged out successfully');
                navigate('/login');
            }
        } catch (error) {
            toast.error('Error logging out');
            throw error;
        }
    };

    const isHotelLister = () => {
        return user?.role === 'hotel_lister';
    };

    return (
        <AuthContext.Provider 
            value={{ user, setUser, login, logout, register, loading, isHotelLister }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};