import Fish from '../components/assets/icon-fish-transpernt.png'

function Footer(){
    return(
        <div id='main-container' style={{background: "black", height: "768px"}}>

            <div id="top-container" style={{display: 'flex', justifyContent: 'space-around'}}>

            <div id='message-box' style={{height: "auto", width: "500px",paddingLeft: "20px", paddingTop: "20px"}}>
                <p style={{color: "#F8FAFC", fontSize: "32px"}}>In a world full of fleeting ideas, Fishtankfr stands as a platform for turning dreams into reality. We empower innovators, creators, and changemakers by providing a space where fundraisers thrive. We don’t just support projects — we help shape the future. Start something impactful today.</p>
            </div>

            <div id='page-visit-box' style={{color: 'white', display: 'flex', flexDirection: 'column', fontSize: '32px'}}>
                <h2 style={{textDecoration: 'underline'}}>VISIT</h2>

                <div id='page-links' style={{display: 'flex', width: '400px', flexWrap: 'wrap', gap: '50px'}}>
                    <p>HOME</p>
                    <p>EXPLORE</p>
                    <p>CAMPAIGNS</p>
                    <p>PROFILE</p>
                    <p>ABOUT</p>
                    <p>TERMS</p>
                </div>
            </div>

            </div>

            <div style={{marginTop: '80px'}} id="marquee-container">
                <h2 style={{color: 'white', textAlign:'center', fontSize: '42px'}}>STAY IN TOUCH</h2>
                <marquee style={{color: 'white', fontSize: '64px', wordSpacing: '100px'}} behavior="alternate" direction="left">INSTAGRAM YOUTUBE TWITTER PINTEREST FACEBOOK LINKEDIN</marquee>
            </div>

            <div id="finalBigLogo-container" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <img style={{height: '60px', width: '60px', position: 'relative', background: 'transparent', left: '-190px', top: '35px'}} src={Fish}/>
                <h1 style={{color: 'white', fontSize: '120px'}} id="finalBigLogo">FISHTANKFR</h1>
            </div>
        </div>
    )
    }
    
    export default Footer;