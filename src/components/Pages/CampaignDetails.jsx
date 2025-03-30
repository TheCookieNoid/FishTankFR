import '../CSS/CampaignDetails.css'
import fishLogoBlack from '../assets/icons8-fish-50.png'
import MainImage from '../assets/detailsPage/Random-1-1.png'
import userProfilePicture from '../assets/Random.png'

function CampaignDetails(){
    return(
        <div className='main-container'>

            <div className='navbar'>
                <div className="main-logo">
                    <h1 style={{position: 'absolute', left: '20px', top: '0px'}}>FISHTANK</h1>
                    <p>FR</p>
                    <img src={fishLogoBlack} alt="fishlogoblack"/>
                </div>
                <ul style={{position: 'absolute', left: '700px', top: '85px'}}>
                    <li><a href="">CAMPAIGNS</a></li>
                    <li><a href="">ABOUT</a></li>
                    <li><a href="">EXPLORE</a></li>
                </ul>
            </div>

            <div className='top-details-container'>
                <img src={MainImage} />
                <div className='inner-details-container'>
                    <h1>RANDOM-1</h1>
                    <img src={userProfilePicture} alt="" />
                    <h2>user-1</h2>
                    <div className='inner-inner-details-container'>
                        <h2>25% Funded</h2>
                        <h2>13D left</h2>
                    </div>
                </div>
            </div>

            <div className='middle-details-container'>
                <h2>THE PROJECT</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>

            <div className='bottom-details-container'>
                <div className='section-photos' id='section-1'></div>
                <div className='section-photos' id='section-2'>
                    <div className='left'></div>
                    <div className='right'></div>
                </div>
                <div className='section-photos' id='section-3'></div>
            </div>

            <div className='backBtn-container'>
                <button id='backBtn'>BACK THIS PROJECT!</button>
            </div>
        </div>
    )
}

export default CampaignDetails