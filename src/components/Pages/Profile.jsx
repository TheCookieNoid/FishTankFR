import '../CSS/Profile.css'
import fishLogoBlack from '../assets/icons8-fish-50.png'

function Profile(){
    return(
        <div className='main-container'>

            <div className='navbar'>
                <div className="main-logo">
                    <h1 style={{position: 'absolute', left: '20px', top: '0px'}}>FISHTANK</h1>
                    <p>FR</p>
                    <img src={fishLogoBlack} alt="fishlogoblack"/>
                </div>
            </div>

            <div className='profile-container'>
                <input type="file" accept='image/*' id='input-profile-image'/>
                <div>
                    <h1>RANDOMUSER1</h1>
                    <div className='social-details'>
                        <div id='followers-section'>
                            <p></p>
                            <p></p>
                        </div>
                        <hr />
                        <div id='campaigns-section'>
                            <p></p>
                            <p></p>
                        </div>
                        <hr />
                        <div id='backed-section'>
                            <p></p>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='user-details'>
                <div className='bio-section'>

                </div>
                <div className='location-section'>

                </div>
                <button>FOLLOW</button>
            </div>

            <div className='campaigns-section'>

            </div>
        </div>
    )
}

export default Profile