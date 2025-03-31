import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Sign-up.css'
import Fish from '../assets/icon-fish-transpernt.png'
import User from '../assets/user.png'
import Pass from '../assets/password.png'
import { userService } from '../../services/api';
import Navbar from '../Navbar'

function SignUP() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        location: '',
        bio: '',
        upi: '',
        profile_picture: null
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile_picture') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await userService.register(formDataToSend);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/landing-page');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className='main-container'>
            <Navbar hideUserMenu={true} />

            <div className='credentials-container'>
                <input 
                    type="text" 
                    name="username" 
                    id="username-input" 
                    placeholder='USERNAME' 
                    value={formData.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    required
                />
                <input 
                    type="email" 
                    name="email" 
                    id="email-input" 
                    placeholder='EMAIL' 
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    required
                />
                <input 
                    type="password" 
                    name="password" 
                    id="password-input" 
                    placeholder='PASSWORD' 
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    required
                />
                <input 
                    type="password" 
                    name="confirm_password" 
                    id="passwordReconfirm-input" 
                    placeholder='RE-ENTER PASSWORD' 
                    value={formData.confirm_password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    required
                />
                <input 
                    type="text" 
                    name="location" 
                    id="location-input" 
                    placeholder='LOCATION' 
                    value={formData.location}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                />
                <textarea 
                    name="bio" 
                    id="bio-input" 
                    placeholder='BIO'
                    value={formData.bio}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{ color: 'black' }}
                />
                <input 
                    type="text" 
                    name="upi" 
                    id="upi-input" 
                    placeholder='UPI ID'
                    value={formData.upi}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                />
                <input 
                    type="file" 
                    id="profile_picture" 
                    name="profile_picture" 
                    accept="image/*"
                    onChange={handleChange}
                />
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                <button 
                    className='getStarted-button'
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
                </button>
            </div>
    
            <div className='redirectToLogin-container'>
                <h2 style={{color: 'white'}}>ALREADY HAVE AN ACCOUNT? <Link to='/' style={{ textDecoration: 'none' }}> <span>LOGIN</span> </Link> </h2>
            </div>
    
            <div className='extraDetails-container'>
                <h3><a href="">ABOUT US</a></h3>
                <h3><a href="">PRIVACY POLICY</a></h3>
                <h3><a href="">TERMS OF USE</a></h3>
            </div>
    
            <h3 style={{color: 'white'}}>© 2025 | Fishtankfr</h3>
        </div>
    );
}

export default SignUP;