import '../CSS/Sign-up.css'
import Fish from '../assets/icon-fish-transpernt.png'
import User from '../assets/user.png'
import Pass from '../assets/password.png'

function SignUP(){
    return(
    <div className='main-container'>
        <div className='logo-container'>
            <img src={Fish} alt="fishtankfrLogo"/>
            <h1 style={{color: 'white'}}>FISHTANKFR</h1>
        </div>

        <div className='credentials-container'>
            <input type="text" name="username" id="username-input" placeholder='USERNAME' required/>
            <input type="password" name="password" id="password-input" placeholder='PASSWORD' required/>
            <input type="password" name='passwordReconfirm' id='passwordReconfirm-input' placeholder='RE-ENTER PASSWORD' required/>
            <button className='getStarted-button'>GET STARTED</button>
        </div>

        <div className='redirectToLogin-container'>
            <h2 style={{color: 'white'}}>ALREADY HAVE AN ACCOUNT? <a href="">LOGIN</a></h2>
        </div>

        <div className='extraDetails-container'>
            <h3><a href="">ABOUT US</a></h3>
            <h3><a href="">PRIVACY POLICY</a></h3>
            <h3><a href="">TERMS OF USE</a></h3>
        </div>

        <h3 style={{color: 'white'}}>© 2025 | Fishtankfr</h3>

    </div>
)
}

export default SignUP