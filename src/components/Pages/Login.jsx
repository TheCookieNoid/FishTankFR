import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Login.css'
import Fish from '../assets/icon-fish-transpernt.png'
import { userService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';  
import Navbar from '../Navbar'


function Login() {
    const navigate = useNavigate();
    const { user, loading, handleLogout } = useAuth(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await userService.login(formData);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/landing-page');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
                    type="password" 
                    name="password" 
                    id="password-input" 
                    placeholder='PASSWORD' 
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    required
                />
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                <button 
                    className='getStarted-button'
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
            </div>
    
            <div className='redirectToLogin-container'>
                <h2 style={{color: 'white'}}>NEVER HAD AN ACCOUNT? <Link to='/sign-up' style={{ textDecoration: 'none' }}> <span>SIGN-UP</span> </Link> </h2>
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

export default Login;