import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/LandingPage.css'
import fishLogoBlack from '../assets/icons8-fish-50.png';
import project1 from '../assets/computerArt.png';
import project2 from '../assets/milkAndHoney.png';
import project3 from '../assets/clothesBrand.png';
import Footer from '../../new-components/Footer.jsx';
import UserProfileMenu from '../UserProfileMenu.jsx';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Navbar';

function LandingPage() {
    const navigate = useNavigate();
    const { user, loading, handleLogout } = useAuth(true);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main-container">
            <Navbar user={user} onLogout={handleLogout} />

            <div className="carousel">
                <div className="carousel-inner">
                    <img src={project1} alt="Project 1" />
                    <img src={project2} alt="Project 2" />
                    <img src={project3} alt="Project 3" />
                    <img src={project1} alt="Project 1" />
                    <img src={project2} alt="Project 2" />
                    <img src={project3} alt="Project 3" />
                </div>
            </div>

            <div className='paragraph-box'>
                <p className='paragraph'>We are a platform for dreamers and doers. Every day, we work to bridge the gap between ideas and reality by providing a space where creators can connect with supporters to bring their projects to life.</p>
                <p className='copyright-logo'>© 2025</p>
            </div>

            <div className='logo-secondPart'>
                <h1>FUNDRAISER</h1>
            </div>

            <div className='black-background'>
                <div className='new-navbar-box'>
                    <ul className='new-navbar'>
                        <li><a href="">FISHTANKFR</a></li>
                        <li><a href="">MENU</a></li>
                    </ul>
                </div>

                <p className='kickstart-headline'>Kickstart Your Dream: Launch Your Fundraiser Today!</p>

                <div className='slider'>
                    <input type="radio" name="slider" id="slide1" checked/>
                    <input type="radio" name="slider" id="slide2" checked/>
                    <input type="radio" name="slider" id="slide3" checked/>
                    <div id='slides'>
                        <div id='overflow'>
                            <div className='inner'>
                                <div className='slide slide_1'>
                                    <div className='slide-content'>
                                        <h2>use the tools provided to start a fundraiser</h2>
                                        <p>Get started easily with step-by-step prompts to set up your fundraiser and goal. Make updates anytime to keep your supporters informed and engaged.</p>
                                    </div>
                                </div>
                                <div className='slide slide_2'>
                                    <div className='slide-content'>
                                        <h2>Reach the backers you want by sharing</h2>
                                        <p>Spread the word by sharing your fundraiser link and utilize your dashboard tools to build momentum and reach your goal.</p>
                                    </div>
                                </div>
                                <div className='slide slide_3'>
                                    <div className='slide-content'>
                                        <h2>Receive the funds securely no middlemen!</h2>
                                        <p>Enter your bank details or invite your beneficiary to add theirs, and start collecting funds directly—no middlemen involved.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='controls'>
                        <label htmlFor="slide1"></label>
                        <label htmlFor="slide2"></label>
                        <label htmlFor="slide3"></label>
                    </div>
                    <div id="bullets">
                        <label htmlFor="slide1"></label>
                        <label htmlFor="slide2"></label>
                        <label htmlFor="slide3"></label>
                    </div>
                </div>
            </div>

            <div id='white-background'>
                <h1>FOR BACKERS</h1>
                <div id='content-box'>
                    <div className='content' id='box-1'>
                        <p>DISCOVER FUNDRAISERS</p>
                    </div>
                    <div className='content' id='box-2'>
                        <p>CHECK FUNDRAISERS DETAILS</p>
                    </div>
                    <div className='content' id='box-3'>
                        <p>MAKE A CONTRIBUTION</p>
                    </div>
                    <div className='content' id='box-4'>
                        <p>STAY UPDATED</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LandingPage;