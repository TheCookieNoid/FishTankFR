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

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='main-container'>
            <Navbar user={user} />

            <div className='campaigns-container'>
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
                    <h2>All Campaigns</h2>
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
            </div>
        </div>
    );
}

export default Campaigns; 