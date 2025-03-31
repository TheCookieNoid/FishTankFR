import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Campaigns.css';
import { campaignService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Navbar';

function Campaigns() {
    const navigate = useNavigate();
    const { user, loading } = useAuth(true);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1
    });

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        min_amount: '',
        max_amount: '',
        ordering: '-created_at' // default to latest
    });

    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
    const [campaignFormData, setCampaignFormData] = useState({
        title: '',
        description: '',
        required_amount: '',
        last_date: '',
        founder: '',
        category: '',
        comment: '',
        main_image: null,
        image_1: null,
        image_2: null,
        image_3: null,
        image_4: null
    });

    useEffect(() => {
        loadCampaigns();
    }, [filters, pagination.currentPage]);

    const loadCampaigns = async () => {
        try {
            setIsLoading(true);
            const params = {
                ...filters,
                page: pagination.currentPage
            };

            // Remove empty filters
            Object.keys(params).forEach(key =>
                !params[key] && delete params[key]
            );

            const response = await campaignService.list(params);
            setCampaigns(response.data.results);
            setPagination(prev => ({
                ...prev,
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous
            }));
            setIsLoading(false);
        } catch (err) {
            setError('Failed to load campaigns');
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const openCampaignModal = (campaign) => {
        setSelectedCampaign(campaign);
        setCurrentImageIndex(0);
        setShowModal(true);
    };

    const closeCampaignModal = () => {
        setShowModal(false);
        setCurrentImageIndex(0);
    };

    const handleNextImage = (e) => {
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
                    prevIndex === campaignImages.length - 1 ? 0 : prevIndex + 1
                );
            }
        }
    };

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

    const openCreateCampaignModal = () => {
        setCampaignFormData({
            title: '',
            description: '',
            required_amount: '',
            last_date: '',
            founder: '',
            category: '',
            comment: '',
            main_image: null,
            image_1: null,
            image_2: null,
            image_3: null,
            image_4: null
        });
        setIsCreatingCampaign(true);
        setShowModal(true);
    };

    const handleCreateCampaignSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Add user ID first (required field)
            formDataToSend.append('user', user.id);

            // Add all non-image fields
            Object.keys(campaignFormData).forEach(key => {
                if (key !== 'main_image' && !key.startsWith('image_')) {
                    formDataToSend.append(key, campaignFormData[key]);
                }
            });

            // Handle main image (required)
            if (campaignFormData.main_image instanceof File) {
                formDataToSend.append('main_image', campaignFormData.main_image);
            } else {
                setError('Main image is required');
                setIsLoading(false);
                return;
            }

            // Handle additional images (optional)
            for (let i = 1; i <= 4; i++) {
                const imageKey = `image_${i}`;
                if (campaignFormData[imageKey] instanceof File) {
                    formDataToSend.append(imageKey, campaignFormData[imageKey]);
                }
            }

            const response = await campaignService.create(formDataToSend);
            
            // Add the new campaign to the list
            setCampaigns(prev => [response.data, ...prev]);
            
            // Reset form and close modal
            setCampaignFormData({
                title: '',
                description: '',
                required_amount: '',
                last_date: '',
                founder: '',
                category: '',
                comment: '',
                main_image: null,
                image_1: null,
                image_2: null,
                image_3: null,
                image_4: null
            });
            setIsCreatingCampaign(false);
            setShowModal(false);
        } catch (err) {
            console.error('Creation error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Campaign creation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCampaignChange = (e) => {
        const { name, value } = e.target;
        setCampaignFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCampaignFormData(prev => ({
                ...prev,
                [e.target.name]: file
            }));
        }
    };

    const handleRemoveImage = (imageName) => {
        setCampaignFormData(prev => ({
            ...prev,
            [imageName]: null
        }));
    };

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='main-container'>
            <Navbar user={user} />

            <div className='campaigns-container'>
                <div className='campaigns-header'>
                    <h2>All Campaigns</h2>
                    {user && (
                        <button 
                            onClick={openCreateCampaignModal}
                            className="primary-button"
                        >
                            Create Campaign
                        </button>
                    )}
                </div>

                {/* <div className='filters-section'>
                    <h2>Filters</h2>
                    <div className='filters-grid'>
                        <div className='filter-item'>
                            <label htmlFor="ordering">Sort By</label>
                            <select
                                id="ordering"
                                name="ordering"
                                value={filters.ordering}
                                onChange={handleFilterChange}
                            >
                                <option value="-created_at">Latest</option>
                                <option value="created_at">Oldest</option>
                                <option value="-amount_generated">Most Funded</option>
                                <option value="amount_generated">Least Funded</option>
                            </select>
                        </div>

                        <div className='filter-item'>
                            <label htmlFor="search">Search</label>
                            <input
                                type="text"
                                id="search"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search campaigns..."
                            />
                        </div>

                        <div className='filter-item'>
                            <label htmlFor="min_amount">Min Amount</label>
                            <input
                                type="number"
                                id="min_amount"
                                name="min_amount"
                                value={filters.min_amount}
                                onChange={handleFilterChange}
                                placeholder="Min amount..."
                            />
                        </div>

                        <div className='filter-item'>
                            <label htmlFor="max_amount">Max Amount</label>
                            <input
                                type="number"
                                id="max_amount"
                                name="max_amount"
                                value={filters.max_amount}
                                onChange={handleFilterChange}
                                placeholder="Max amount..."
                            />
                        </div>
                    </div>
                </div> */}

                <div className='campaigns-section'>
                    {campaigns.length === 0 ? (
                        <p>No campaigns found matching your criteria.</p>
                    ) : (
                        <>
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
                                            <p className='campaign-founder'>by {campaign.founder}</p>
                                            <div className='campaign-progress-bar'>
                                                <div
                                                    className='progress-fill'
                                                    style={{
                                                        width: `${Math.min(
                                                            Math.round((campaign.amount_generated / campaign.required_amount) * 100),
                                                            100
                                                        )}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className='campaign-stats-mini'>
                                                <span>₹ {campaign.amount_generated} raised</span>
                                                <span>{Math.round((campaign.amount_generated / campaign.required_amount) * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='pagination'>
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.previous}
                                    className='pagination-button'
                                >
                                    Previous
                                </button>
                                <span className='pagination-info'>
                                    Page {pagination.currentPage} of {Math.ceil(pagination.count / 10)}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.next}
                                    className='pagination-button'
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Campaign Modal */}
                {showModal && selectedCampaign && (
                    <div className='modal-overlay'>
                        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                            <button className='modal-close-btn' onClick={closeCampaignModal}>×</button>
                            <div className='modal-header'>
                                <h3>{selectedCampaign.title}</h3>
                            </div>
                            <div className='modal-body'>
                                <div className='campaign-description-container'>
                                    <h4>Description</h4>
                                    <p className='campaign-description'>{selectedCampaign.description}</p>
                                </div>
                                <div className='campaign-image-carousel'>
                                    {(() => {
                                        const campaignImages = [
                                            selectedCampaign.main_image,
                                            selectedCampaign.image_1,
                                            selectedCampaign.image_2,
                                            selectedCampaign.image_3,
                                            selectedCampaign.image_4
                                        ].filter(Boolean);

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
                                            <span className='stat-label'>Raised</span>
                                            <span className='stat-value'>₹ {selectedCampaign.amount_generated}</span>
                                        </div>
                                        <div className='stat-item'>
                                            <span className='stat-label'>Goal</span>
                                            <span className='stat-value'>₹ {selectedCampaign.required_amount}</span>
                                        </div>
                                        <div className='stat-item'>
                                            <span className='stat-label'>Funding Percentage</span>
                                            <span className='stat-value'>
                                                {Math.round((selectedCampaign.amount_generated / selectedCampaign.required_amount) * 100)}%
                                            </span>
                                        </div>
                                        <div className='stat-item'>
                                            <span className='stat-label'>End Date</span>
                                            <span className='stat-value'>
                                                {new Date(selectedCampaign.last_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className='stat-item'>
                                            <span className='stat-label'>Days Remaining</span>
                                            <span className='stat-value'>
                                                {Math.max(0, Math.ceil((new Date(selectedCampaign.last_date) - new Date()) / (1000 * 60 * 60 * 24)))}
                                            </span>
                                        </div>
                                        <div className='stat-item'>
                                            <span className='stat-label'>Category</span>
                                            <span className='stat-value'>{selectedCampaign.category}</span>
                                        </div>
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
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Create Campaign Modal */}
                {showModal && isCreatingCampaign && (
                    <div className='modal-overlay'>
                        <div className='modal-content edit-campaign-modal' onClick={(e) => e.stopPropagation()}>
                            <button className='modal-close-btn' onClick={() => {
                                setShowModal(false);
                                setIsCreatingCampaign(false);
                            }}>×</button>
                            <div className='modal-header'>
                                <h3>Create New Campaign</h3>
                            </div>
                            <div className='modal-body'>
                                <form onSubmit={handleCreateCampaignSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="title">Campaign Title *</label>
                                        <input
                                            id="title"
                                            type="text"
                                            name="title"
                                            value={campaignFormData.title}
                                            onChange={handleCampaignChange}
                                            required
                                            maxLength={200}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description *</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={campaignFormData.description}
                                            onChange={handleCampaignChange}
                                            required
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="founder">Founder Name *</label>
                                        <input
                                            id="founder"
                                            type="text"
                                            name="founder"
                                            value={campaignFormData.founder}
                                            onChange={handleCampaignChange}
                                            required
                                            maxLength={200}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group half">
                                            <label htmlFor="required_amount">Funding Goal (₹) *</label>
                                            <input
                                                id="required_amount"
                                                type="number"
                                                name="required_amount"
                                                value={campaignFormData.required_amount}
                                                onChange={handleCampaignChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group half">
                                            <label htmlFor="category">Category *</label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={campaignFormData.category}
                                                onChange={handleCampaignChange}
                                                required
                                                className="form-control"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="tech">Tech</option>
                                                <option value="art">Art</option>
                                                <option value="food">Food</option>
                                                <option value="education">Education</option>
                                                <option value="social">Social</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="last_date">End Date *</label>
                                        <input
                                            id="last_date"
                                            type="date"
                                            name="last_date"
                                            value={campaignFormData.last_date}
                                            onChange={handleCampaignChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment">Additional Comments</label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            value={campaignFormData.comment}
                                            onChange={handleCampaignChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="images-section">
                                        <h4>Campaign Images</h4>
                                        <div className="current-images">
                                            <div className="image-upload-group">
                                                <label>Main Image *</label>
                                                <div className="image-preview">
                                                    {campaignFormData.main_image && (
                                                        <div className="image-item">
                                                            <img
                                                                src={campaignFormData.main_image instanceof File 
                                                                    ? URL.createObjectURL(campaignFormData.main_image)
                                                                    : campaignFormData.main_image}
                                                                alt="Main campaign image"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="remove-image-btn"
                                                                onClick={() => handleRemoveImage('main_image')}
                                                            >×</button>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        id="main_image"
                                                        name="main_image"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                        required={!campaignFormData.main_image}
                                                        className="file-input"
                                                    />
                                                </div>
                                            </div>

                                            {[1, 2, 3, 4].map((num) => (
                                                <div key={num} className="image-upload-group">
                                                    <label>Additional Image {num}</label>
                                                    <div className="image-preview">
                                                        {campaignFormData[`image_${num}`] && (
                                                            <div className="image-item">
                                                                <img
                                                                    src={campaignFormData[`image_${num}`] instanceof File 
                                                                        ? URL.createObjectURL(campaignFormData[`image_${num}`])
                                                                        : campaignFormData[`image_${num}`]}
                                                                    alt={`Campaign image ${num}`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="remove-image-btn"
                                                                    onClick={() => handleRemoveImage(`image_${num}`)}
                                                                >×</button>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            id={`image_${num}`}
                                                            name={`image_${num}`}
                                                            onChange={handleImageChange}
                                                            accept="image/*"
                                                            className="file-input"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {error && <div className="error-message">{error}</div>}

                                    <div className='button-group'>
                                        <button type="submit" disabled={isLoading} className="primary-button">
                                            {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setIsCreatingCampaign(false);
                                            }}
                                            className="secondary-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Campaigns; 