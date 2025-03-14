import "../CSS/Login.css"
import Fish from "../assets/icon-fish-transpernt.png"

function Login(){
    return(
        <div className="All-INFO">
            <div className="Name-logo-info">
                <img src={Fish}></img>
                <h1>FISHTANKFR</h1>
                <p>
                    Your support turns ideas into reality.<br></br>
                    Join us in making an impact!
                </p>
            </div>
            <div className="square">
            <div className="circle-1"></div>
            <div className="circle-2"></div>
            <div className="circle-3"></div>
            <div className="circle-4"></div>
            <div className="circle-5"></div>
                <h1 className="first">
                    START YOUR 
                </h1>
                <h1 className="second">
                    fundraiser now! 
                </h1>
                <button className="sign-up">
                    SIGN UP
                    </button>
                <button className="LOGIN">
                    LOGIN
                    </button>
                </div>
            
        </div>
    );

}
export default Login