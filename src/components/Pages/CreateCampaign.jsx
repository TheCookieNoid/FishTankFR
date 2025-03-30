import '../CSS/CreateCampaign.css'
import fishLogoBlack from '../assets/icons8-fish-50.png'
import Footer from '../../new-components/Footer.jsx'
import Navbar from '../Navbar'
import { useAuth } from '../../hooks/useAuth'


function CreateCampaign() {
    const { user, loading, handleLogout } = useAuth(true);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='main-container'>

            <Navbar user={user} onLogout={handleLogout} />

            <div className='user-input-container'>
                <label htmlFor="projectTitle" id='label-projectTitle'>GIVE A TITLE TO YOUR CAMPAIGN</label>
                <input style={{ background: 'black', color: 'white' }} type="text" name="projectTitle" id="projectTitle" placeholder='TITLE' required />

                <label htmlFor="projectDescription" id='label-projectDescription'>DESCRIBE YOUR PROJECT:</label>
                <input style={{ background: 'black', color: 'white' }} type="text" name='projectDescription' id='projectDescription' placeholder='DESCRIPTION' required />

                <label htmlFor="estimateAmount" id='label-estimateAmount'>Amount you are looking to raise:</label>
                <input style={{ background: 'black', color: 'white' }} type="number" name="estimateAmount" id="estimateAmount" placeholder='₹' required />

                <label htmlFor="projectImages" id='label-projectImages'>Provide some photos for your campaign: (5 max)</label>
                <div>
                    <input type="file" accept="image/*" name="projectImages-1" id="projectImages" required />
                    <input type="file" accept="image/*" name="projectImages-2" id="projectImages" required />
                    <input type="file" accept="image/*" name="projectImages-3" id="projectImages" required />
                    <input type="file" accept="image/*" name="projectImages-4" id="projectImages" required />
                    <input type="file" accept="image/*" name="projectImages-5" id="projectImages" required />
                </div>

                <label htmlFor="category-dropdown" id='label-category-dropdown'>CATEGORY OF YOUR CAMPAIGN?</label>
                <div class="dropdown">
                    <button>CATEGORY</button>
                    <div class="content">
                        <p>ARTS</p>
                        <p>CRAFTS</p>
                        <p>TECHNOLOGY</p>
                        <p>FASHION</p>
                        <p>FILM</p>
                        <p>MUSIC</p>
                        <p>PHOTOGRAPHY</p>
                        <p>GAMES</p>
                    </div>
                </div>
            </div>

            <button
                style={{ background: '#66FF82', padding: '16px', borderRadius: '8px', fontSize: '18px', position: 'absolute', top: '720px', left: '20px' }}
            >RUN YOUR CAMPAIGN!</button>
        </div>
    )
}

export default CreateCampaign