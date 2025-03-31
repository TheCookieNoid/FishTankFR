import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/CampaignDetails.css'
import { campaignService, userService, investmentService } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import Navbar from '../Navbar'

function CampaignDetails() {
    
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading, handleLogout } = useAuth(true);
    const [campaign, setCampaign] = useState(null);
    const [founder, setFounder] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [userInvestments, setUserInvestments] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [investmentError, setInvestmentError] = useState('');
    const [isInvesting, setIsInvesting] = useState(false);

    useEffect(() => {
        loadCampaignDetails();
    }, [id]);

    const loadCampaignDetails = async () => {
        try {
            const response = await campaignService.get(id);
            setCampaign(response.data);

            // Load founder details and related data
            const founderResponse = await userService.get(response.data.user);
            setFounder(founderResponse.data);

            // Load additional user data
            const campaignsResponse = await userService.getUserCampaigns(response.data.user);
            const investmentsResponse = await userService.getUserInvestments(response.data.user);
            const statsResponse = await userService.getUserStatistics(response.data.user);
            /* const [campaignsResponse, investmentsResponse, statsResponse] = await Promise.all([
                userService.getUserCampaigns(response.data.user),
                userService.getUserInvestments(response.data.user),
                userService.getUserStatistics(response.data.user)
            ]); */

            setUserCampaigns(campaignsResponse.data);
            setUserInvestments(investmentsResponse.data);
            setUserStats(statsResponse.data);
        } catch (err) {
            setError('Failed to load campaign details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvest = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        // TODO: Implement invest functionality
        console.log('Investing in campaign:', id);
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        if (campaign) {
            const campaignImages = [
                campaign.main_image,
                campaign.image_1,
                campaign.image_2,
                campaign.image_3,
                campaign.image_4
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
        if (campaign) {
            const campaignImages = [
                campaign.main_image,
                campaign.image_1,
                campaign.image_2,
                campaign.image_3,
                campaign.image_4
            ].filter(Boolean);
            if (campaignImages.length > 0) {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === 0 ? campaignImages.length - 1 : prevIndex - 1
                );
            }
        }
    };

    const handleInvestment = async (e) => {
        e.preventDefault();
        setInvestmentError('');
        setIsInvesting(true);

        try {
            if (!user) {
                navigate('/login');
                return;
            }

            const amount = parseFloat(investmentAmount);
            if (isNaN(amount) || amount <= 0) {
                setInvestmentError('Please enter a valid amount');
                return;
            }

            const investmentData = {
                user: user.id,
                campaign: campaign.id,
                invested_amount: amount.toString() // Convert to string for FormData
            };

            await investmentService.create(investmentData);
            
            // Refresh campaign details to show updated amount
            loadCampaignDetails();
            setShowInvestModal(false);
            setInvestmentAmount('');
        } catch (err) {
            setInvestmentError(err.response?.data?.message || 'Investment failed. Please try again.');
        } finally {
            setIsInvesting(false);
        }
    };

    const isOwner = campaign?.user === user?.id;

    const handleDeleteCampaign = async () => {
        if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
            try {
                setIsLoading(true);
                await campaignService.delete(campaign.id);
                navigate('/profile');
            } catch (err) {
                setError('Failed to delete campaign');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !campaign || !founder) {
        return <div>{error || 'Campaign not found'}</div>;
    }

    const fundingPercentage = Math.round((campaign.amount_generated / campaign.required_amount) * 100);
    const daysRemaining = Math.max(0, Math.ceil((new Date(campaign.last_date) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <div className='main-container'>
            <Navbar user={user} onLogout={handleLogout} />

            <div className='campaign-details-container'>
                <div className='campaign-image-carousel'>
                    {(() => {
                        const campaignImages = [
                            campaign.main_image,
                            campaign.image_1,
                            campaign.image_2,
                            campaign.image_3,
                            campaign.image_4
                        ].filter(Boolean);

                        return campaignImages.length > 0 ? (
                            <>
                                <div className='campaign-image-container'>
                                    <img
                                        src={campaignImages[currentImageIndex]}
                                        alt={`${campaign.title} - Image ${currentImageIndex + 1}`}
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
                                    alt={campaign.title}
                                    className='campaign-modal-image'
                                />
                            </div>
                        );
                    })()}
                </div>

                <div className='campaign-info-section'>
                    <div className='campaign-header'>
                        <h1>{campaign.title}</h1>
                    </div>

                    <div className='campaign-description'>
                        <h2>About This Campaign</h2>
                        <p>{campaign.description}</p>
                    </div>

                    <div className='founder-details'>
                        <h2>About The Founder</h2>
                        <div className='founder-details-header'>
                            <img
                                src={founder.profile_picture || '/default-profile.png'}
                                alt={founder.username}
                            />
                            <h3>{founder.username}</h3>
                        </div>
                        <div className='founder-stats'>
                            <div className='founder-stat-item'>
                                <div className='founder-stat-label'>Total Campaigns</div>
                                <div className='founder-stat-value'>{userStats?.total_campaigns || 0}</div>
                            </div>
                            <div className='founder-stat-item'>
                                <div className='founder-stat-label'>Active Campaigns</div>
                                <div className='founder-stat-value'>{userStats?.active_campaigns || 0}</div>
                            </div>
                            <div className='founder-stat-item'>
                                <div className='founder-stat-label'>Total Investments</div>
                                <div className='founder-stat-value'>{userStats?.total_investments || 0}</div>
                            </div>
                            <div className='founder-stat-item'>
                                <div className='founder-stat-label'>Total Raised</div>
                                <div className='founder-stat-value'>₹ {userStats?.total_invested_amount || 0}</div>
                            </div>
                        </div>
                    </div>

                    <div className='campaign-progress'>
                        <h2>Campaign Progress</h2>
                        <div className='progress-bar'>
                            <div
                                className='progress-fill'
                                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                            ></div>
                        </div>
                        <div className='progress-info'>
                            <span>{fundingPercentage}% FUNDED</span>
                            <span>{daysRemaining} DAYS LEFT</span>
                        </div>

                        <div className='campaign-stats'>
                            <div className='campaign-stat-item'>
                                <div className='stat-icon'>💰</div>
                                <div className='stat-label'>RAISED</div>
                                <div className='stat-value'>₹ {campaign.amount_generated}</div>
                            </div>

                            <div className='campaign-stat-item'>
                                <div className='stat-icon'>🎯</div>
                                <div className='stat-label'>GOAL</div>
                                <div className='stat-value'>₹ {campaign.required_amount}</div>
                            </div>

                            <div className='campaign-stat-item'>
                                <div className='stat-icon'>👥</div>
                                <div className='stat-label'>BACKERS</div>
                                <div className='stat-value'>{userInvestments.length}</div>
                            </div>

                            <div className='campaign-stat-item'>
                                <div className='stat-icon'>📅</div>
                                <div className='stat-label'>END DATE</div>
                                <div className='stat-value'>{new Date(campaign.last_date).toLocaleDateString()}</div>
                            </div>

                            <div className='campaign-stat-item'>
                                <div className='stat-icon'>⚡</div>
                                <div className='stat-label'>STATUS</div>
                                <div className='stat-value'>{daysRemaining > 0 ? 'ACTIVE' : 'ENDED'}</div>
                            </div>

                            <div className='campaign-stat-item'>
                                <div className='stat-icon'>📊</div>
                                <div className='stat-label'>CATEGORY</div>
                                <div className='stat-value'>{campaign.category.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>

                    <div className='campaign-actions'>
                        {isOwner ? (
                            <div className='owner-actions'>
                                <button 
                                    className='primary-button'
                                    onClick={() => navigate(`/campaign/${campaign.id}/edit`)}
                                >
                                    Edit Campaign
                                </button>
                                <button 
                                    className='delete-button'
                                    onClick={handleDeleteCampaign}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Deleting...' : 'Delete Campaign'}
                                </button>
                            </div>
                        ) : (
                            <button 
                                className='primary-button large'
                                onClick={() => setShowInvestModal(true)}
                            >
                                Back this project
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Updated Investment Modal */}
            {showInvestModal && (
                <div className='modal-overlay'>
                    <div className='modal-content investment-modal'>
                        <button className='modal-close-btn' onClick={() => setShowInvestModal(false)}>×</button>
                        <div className='modal-header'>
                            <h2>Back this project</h2>
                        </div>
                        <div className='modal-body'>
                            <div className='investment-stats'>
                                <div className='stat-item'>
                                    <h3>Campaign Goal</h3>
                                    <p className='amount'>₹{campaign.required_amount}</p>
                                </div>
                                <div className='stat-item'>
                                    <h3>Amount Raised</h3>
                                    <p className='amount'>₹{campaign.amount_generated}</p>
                                </div>
                                <div className='stat-item'>
                                    <h3>Remaining</h3>
                                    <p className='amount'>₹{campaign.required_amount - campaign.amount_generated}</p>
                                </div>
                            </div>

                            <form onSubmit={handleInvestment} className='investment-form'>
                                <div className='form-group'>
                                    <label htmlFor='investment-amount'>Enter your contribution amount (₹)</label>
                                    <input
                                        type='number'
                                        id='investment-amount'
                                        value={investmentAmount}
                                        onChange={(e) => setInvestmentAmount(e.target.value)}
                                        min='1'
                                        step='0.01'
                                        required
                                        className='form-control large'
                                    />
                                </div>
                                {investmentError && (
                                    <div className='error-message'>{investmentError}</div>
                                )}
                                <div className='button-group'>
                                    <button
                                        type='submit'
                                        className='primary-button large'
                                        disabled={isInvesting}
                                    >
                                        {isInvesting ? 'Processing...' : 'Confirm Contribution'}
                                    </button>
                                    <button
                                        type='button'
                                        className='secondary-button large'
                                        onClick={() => setShowInvestModal(false)}
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
    )
}

export default CampaignDetails