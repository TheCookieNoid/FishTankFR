import '../CSS/Sign-up.css'

function SignUP(){
    return(
        <div className='main-container'>
                   <div className='Name-logo'>
                   <img src={Fish}></img>
                   <h1>FISHTANKFR</h1>
                   </div>
                   <div className='user-pass-start'>
                       <div className='user'>
                           <img src={User}></img>
                    <input className='username' placeholder='USERNAME'></input>
                    </div>
                       <div className='pass'>
                           <img src={Pass}></img>
                    <input className='password' placeholder='PASSWORD'></input>
                    </div>
                    <button className='start'>
                       GET STARTED
                       </button>
                       <div className='create-forgot'>
                   <h1 className='create'>CREATE ACCOUNT?</h1>
                   <h1 className='forget'>FORGET PASSWORD?</h1>
                   </div>
                   </div>
                   <div className='footer'>
                       <div className='information'>
                               <h2>ABOUT US</h2>
                               <h2>PRIVACY POLICY</h2>
                               <h2>TERMS OF USE</h2>
                       </div>
                       <div className='copyright'>
                     <h2>© 2025 | Fishtankfr</h2>
                       </div>
                   </div>
               </div>
    );
}

export default SignUP