import React from 'react';
import { Link } from 'react-router-dom';
import fishLogoBlack from './assets/icons8-fish-50.png';
import UserProfileMenu from './UserProfileMenu';
import './CSS/Navbar.css';

function Navbar({ user, onLogout }) {
    return (
        <div className="navbar">
            <Link to="/" className="main-logo">
                <h1>FISHTANK</h1>
                <p>FR</p>
                <img src={fishLogoBlack} alt="fishlogoblack"/>
            </Link>
            <ul>
                <li><Link to="/campaigns">CAMPAIGNS</Link></li>
                <li><Link to="/about">ABOUT</Link></li>
                <li><Link to="/explore">EXPLORE</Link></li>
            </ul>
            <UserProfileMenu user={user} onLogout={onLogout} />
        </div>
    );
}

export default Navbar; 