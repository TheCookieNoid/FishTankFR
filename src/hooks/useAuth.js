import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = (requireAuth = true) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    useEffect(() => {
        if (!loading) {
            if (requireAuth && !user) {
                navigate('/');
            } else if (!requireAuth && user) {
                navigate('/landing-page');
            }
        }
    }, [user, loading, requireAuth, navigate]);

    return { user, loading, handleLogout };
}; 