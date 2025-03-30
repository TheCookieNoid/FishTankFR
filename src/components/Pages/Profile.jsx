import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Profile.css'
import fishLogoBlack from '../assets/icons8-fish-50.png'
import { userService, campaignService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Navbar'
function Profile() {
    const navigate = useNavigate();
    const { user, loading, handleLogout } = useAuth(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        location: '',
        bio: '',
        upi: '',
        profile_picture: null
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isEditingCampaign, setIsEditingCampaign] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [campaignFormData, setCampaignFormData] = useState({
        title: '',
        description: '',
        required_amount: '',
        last_date: '',
        images: []
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                location: user.location || '',
                bio: user.bio || '',
                upi: user.upi || '',
                profile_picture: null
            });
            loadUserCampaigns();
        }
    }, [user]);

    // Initialize campaign form data when a campaign is selected for editing
    useEffect(() => {
        if (selectedCampaign && isEditingCampaign) {
            setCampaignFormData({
                title: selectedCampaign.title || '',
                description: selectedCampaign.description || '',
                required_amount: selectedCampaign.required_amount || '',
                last_date: selectedCampaign.last_date ? new Date(selectedCampaign.last_date).toISOString().split('T')[0] : '',
                images: selectedCampaign.images || []
            });
        }
    }, [selectedCampaign, isEditingCampaign]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showModal && event.target.classList.contains('modal-overlay')) {
                setShowModal(false);
                setIsEditingCampaign(false);
                setCurrentImageIndex(0);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal]);

    const loadUserCampaigns = async () => {
        try {
            const response = await userService.getUserCampaigns(user.id);
            setCampaigns(response.data);
        } catch (err) {
            setError('Failed to load campaigns');
        }
    };

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

    const handleCampaignChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'campaign_images') {
            // Handle multiple image uploads
            const newImages = Array.from(files);
            setCampaignFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } else {
            setCampaignFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await userService.updateProfile(user.id, formDataToSend);
            localStorage.setItem('user', JSON.stringify(response.data));
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await userService.updatePassword(passwordData);
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            setIsPasswordEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Password update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCampaignSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(campaignFormData).forEach(key => {
                if (key !== 'images') {
                    formDataToSend.append(key, campaignFormData[key]);
                }
            });

            // Append each image separately
            campaignFormData.images.forEach((image, index) => {
                if (image instanceof File) {
                    formDataToSend.append(`images[${index}]`, image);
                }
            });

            await campaignService.updateCampaign(selectedCampaign.id, formDataToSend);
            loadUserCampaigns();
            setIsEditingCampaign(false);
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Campaign update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle opening campaign modal
    const openCampaignModal = (campaign) => {
        setSelectedCampaign(campaign);
        setCurrentImageIndex(0);
        setShowModal(true);
    };

    // Handle closing campaign modal
    const closeCampaignModal = () => {
        setShowModal(false);
        setIsEditingCampaign(false);
        setCurrentImageIndex(0);
    };

    // Handle next image in carousel
    const handleNextImage = (e) => {
        e.stopPropagation();
        if (selectedCampaign) {
            const campaignImages = [
                selectedCampaign.main_image,
                selectedCampaign.image_1,
                selectedCampaign.image_2,
                selectedCampaign.image_3,
                selectedCampaign.image_4
            ].filter(Boolean); // filter out any falsy values
            if (campaignImages.length > 0) {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === campaignImages.length - 1 ? 0 : prevIndex + 1
                );
            }
        }
    };

    // Handle previous image in carousel
    const handlePrevImage = (e) => {
        e.stopPropagation();
        if (selectedCampaign) {
            const campaignImages = [
                selectedCampaign.main_image,
                selectedCampaign.image_1,
                selectedCampaign.image_2,
                selectedCampaign.image_3,
                selectedCampaign.image_4
            ].filter(Boolean);
            if (campaignImages.length > 0) {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === 0 ? campaignImages.length - 1 : prevIndex - 1
                );
            }
        }
    };

    // Remove image from campaign form
    const handleRemoveImage = (index) => {
        setCampaignFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='main-container'>
            <Navbar user={user} onLogout={handleLogout} />

            <div className='profile-container'>
                <div className='profile-header'>
                    <div className='profile-picture-container'>
                        <label htmlFor="input-profile-image" className="profile-picture-edit">
                            <div className="edit-overlay">
                                {isEditing && <span>Change Photo</span>}
                            </div>
                        </label>
                        <input
                            type="file"
                            accept='image/*'
                            id='input-profile-image'
                            name="profile_picture"
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                        <img
                            src={formData.profile_picture ? URL.createObjectURL(formData.profile_picture) : user.profile_picture}
                            alt="Profile"
                        />
                    </div>
                    <div className='profile-info'>
                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        id="location"
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter your location"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bio">Bio</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="upi">UPI ID</label>
                                    <input
                                        id="upi"
                                        type="text"
                                        name="upi"
                                        value={formData.upi}
                                        onChange={handleChange}
                                        placeholder="Enter your UPI ID"
                                    />
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                <div className='button-group'>
                                    <button type="submit" disabled={isLoading} className="primary-button">
                                        {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="secondary-button">
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h1>{user.username}</h1>
                                <p>{user.email}</p>
                                {user.location && <p>📍 {user.location}</p>}
                                {user.bio && <p>{user.bio}</p>}
                                {user.upi && <p>UPI: {user.upi}</p>}
                                <div className='button-group'>
                                    <button onClick={() => setIsEditing(true)} className="primary-button">
                                        EDIT PROFILE
                                    </button>
                                    <button onClick={() => setIsPasswordEditing(true)} className="secondary-button">
                                        CHANGE PASSWORD
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {isPasswordEditing && (
                    <div className='password-form-container'>
                        <form onSubmit={handlePasswordSubmit}>
                            <h2>Change Password</h2>
                            <div className="form-group">
                                <label htmlFor="current_password">Current Password</label>
                                <input
                                    id="current_password"
                                    type="password"
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="new_password">New Password</label>
                                <input
                                    id="new_password"
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm_password">Confirm New Password</label>
                                <input
                                    id="confirm_password"
                                    type="password"
                                    name="confirm_password"
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className='button-group'>
                                <button type="submit" disabled={isLoading} className="primary-button">
                                    {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                                </button>
                                <button type="button" onClick={() => setIsPasswordEditing(false)} className="secondary-button">
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className='social-details'>
                    <div id='followers-section'>
                        <p>Followers</p>
                        <p>0</p>
                    </div>
                    <hr />
                    <div id='campaigns-section'>
                        <p>Campaigns</p>
                        <p>{campaigns.length}</p>
                    </div>
                    <hr />
                    <div id='backed-section'>
                        <p>Backed</p>
                        <p>0</p>
                    </div>
                </div>
            </div>

            <div className='campaigns-section'>
                <h2>Your Campaigns</h2>
                {campaigns.length === 0 ? (
                    <p>No campaigns yet. Start your first campaign!</p>
                ) : (
                    <div className='campaigns-grid'>
                        {campaigns.map(campaign => (
                            <div key={campaign.id} className='campaign-card'>
                                <div className='campaign-thumbnail' onClick={() => openCampaignModal(campaign)}>
                                    <img
                                        src={campaign.main_image || '/default-campaign.png'}
                                        alt={campaign.title}
                                    />
                                </div>
                                <div className='campaign-card-info'>
                                    <h4>{campaign.title}</h4>
                                    <p>₹ {campaign.amount_generated} raised</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Campaign Modal */}
            {showModal && selectedCampaign && !isEditingCampaign && (
                <div className='modal-overlay'>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <button className='modal-close-btn' onClick={closeCampaignModal}>×</button>
                        <div className='modal-header'>
                            <h3>{selectedCampaign.title}</h3>
                        </div>
                        <div className='modal-body'>
                            <div className='campaign-image-carousel'>
                                {/* Construct images array dynamically */}
                                {(() => {
                                    const campaignImages = [
                                        selectedCampaign.main_image,
                                        selectedCampaign.image_1,
                                        selectedCampaign.image_2,
                                        selectedCampaign.image_3,
                                        selectedCampaign.image_4
                                    ].filter(Boolean); // Remove null/undefined

                                    return campaignImages.length > 0 ? (
                                        <>
                                            <div className='campaign-image-container'>
                                                <img
                                                    src={campaignImages[currentImageIndex]}
                                                    alt={`${selectedCampaign.title} - Image ${currentImageIndex + 1}`}
                                                    className='campaign-modal-image'
                                                />
                                            </div>
                                            {campaignImages.length > 1 && (
                                                <div className='carousel-controls'>
                                                    <button className='carousel-control prev' onClick={handlePrevImage}>❮</button>
                                                    <span className='carousel-indicator'>{currentImageIndex + 1} / {campaignImages.length}</span>
                                                    <button className='carousel-control next' onClick={handleNextImage}>❯</button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className='campaign-image-container'>
                                            <img
                                                src='/default-campaign.png'
                                                alt={selectedCampaign.title}
                                                className='campaign-modal-image'
                                            />
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className='campaign-details'>
                                <div className='campaign-stats'>
                                    <div className='stat-item'>
                                        <span className='stat-label'>Raised:</span>
                                        <span className='stat-value'>₹ {selectedCampaign.amount_generated}</span>
                                    </div>
                                    <div className='stat-item'>
                                        <span className='stat-label'>Goal:</span>
                                        <span className='stat-value'>₹ {selectedCampaign.required_amount}</span>
                                    </div>
                                    <div className='stat-item'>
                                        <span className='stat-label'>Funding Percentage:</span>
                                        <span className='stat-value'>
                                            {Math.round((selectedCampaign.amount_generated / selectedCampaign.required_amount) * 100)}%
                                        </span>
                                    </div>
                                    <div className='stat-item'>
                                        <span className='stat-label'>End Date:</span>
                                        <span className='stat-value'>
                                            {new Date(selectedCampaign.last_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className='stat-item'>
                                        <span className='stat-label'>Days Remaining:</span>
                                        <span className='stat-value'>
                                            {Math.max(0, Math.ceil((new Date(selectedCampaign.last_date) - new Date()) / (1000 * 60 * 60 * 24)))}
                                        </span>
                                    </div>
                                </div>
                                <div className='campaign-description-container'>
                                    <h4>Description</h4>
                                    <p className='campaign-description'>{selectedCampaign.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button
                                onClick={() => navigate(`/campaign/${selectedCampaign.id}`)}
                                className="primary-button"
                            >
                                View Full Campaign
                            </button>
                            <button
                                onClick={() => setIsEditingCampaign(true)}
                                className="secondary-button"
                            >
                                Edit Campaign
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Edit Campaign Modal */}
            {showModal && selectedCampaign && isEditingCampaign && (
                <div className='modal-overlay'>
                    <div className='modal-content edit-campaign-modal' onClick={(e) => e.stopPropagation()}>
                        <button className='modal-close-btn' onClick={closeCampaignModal}>×</button>
                        <div className='modal-header'>
                            <h3>Edit Campaign</h3>
                        </div>
                        <div className='modal-body'>
                            <form onSubmit={handleCampaignSubmit}>
                                <div className="form-group">
                                    <label htmlFor="title">Campaign Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={campaignFormData.title}
                                        onChange={handleCampaignChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={campaignFormData.description}
                                        onChange={handleCampaignChange}
                                        required
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="required_amount">Funding Goal (₹)</label>
                                    <input
                                        id="required_amount"
                                        type="number"
                                        name="required_amount"
                                        value={campaignFormData.required_amount}
                                        onChange={handleCampaignChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="last_date">End Date</label>
                                    <input
                                        id="last_date"
                                        type="date"
                                        name="last_date"
                                        value={campaignFormData.last_date}
                                        onChange={handleCampaignChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="campaign_images">Campaign Images</label>
                                    <input
                                        id="campaign_images"
                                        type="file"
                                        name="campaign_images"
                                        onChange={handleCampaignChange}
                                        accept="image/*"
                                        multiple
                                    />
                                </div>

                                <div className="current-images">
                                    <h4>Current Images:</h4>
                                    <div className="images-grid">
                                        {campaignFormData.images.map((image, index) => (
                                            <div key={index} className="image-item">
                                                <img
                                                    src={image instanceof File ? URL.createObjectURL(image) : image}
                                                    alt={`Campaign image ${index + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <div className='button-group'>
                                    <button type="submit" disabled={isLoading} className="primary-button">
                                        {isLoading ? 'SAVING...' : 'SAVE CAMPAIGN'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingCampaign(false)}
                                        className="secondary-button"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;