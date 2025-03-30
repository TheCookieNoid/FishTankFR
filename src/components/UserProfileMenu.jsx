import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './CSS/UserProfileMenu.css';

function UserProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { user, loading, handleLogout } = useAuth(true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleViewProfile = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    if (loading || !user) {
        return null; // Or return a login button/link
    }

    return (
        <div className="profile-menu-container" ref={menuRef}>
            <div 
                className="profile-picture" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <img 
                    src={user.profile_picture || '/default-profile.png'} 
                    alt="Profile" 
                />
            </div>
            
            {isOpen && (
                <div className="profile-menu">
                    <div className="menu-item" onClick={handleViewProfile}>
                        View Profile
                    </div>
                    <div className="menu-item" onClick={handleLogout}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfileMenu; 