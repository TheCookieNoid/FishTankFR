import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/CampaignDetails.css'
import { campaignService, userService } from '../../services/api'
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
                        <button
                            className='back-project-btn'
                            onClick={handleInvest}
                            disabled={!user}
                        >
                            {user ? 'BACK THIS PROJECT!' : 'LOGIN TO BACK THIS PROJECT'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampaignDetails