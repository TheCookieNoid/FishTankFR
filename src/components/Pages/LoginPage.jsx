import "../CSS/Login.css"
import Fish from "../assets/icon-fish-transpernt.png"
import RandomIMG from "../assets/Random.png"
import Hesienberg from "../assets/hesienberg.png"
import Social from "../assets/social.png"
import { Link } from "react-router-dom";
function MainPage(){
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
            <div className="circle-1"><img src={RandomIMG}></img></div>
            <div className="circle-2"><img src={RandomIMG}></img></div>
            <div className="circle-3"><img src={Social}></img></div>
            <div className="circle-4"><img src={Hesienberg}></img></div>
            <div className="circle-5"><img src={RandomIMG}></img></div>
            <div className="circle-6"><img src={RandomIMG}></img></div>
            <div className="circle-7"><img src={RandomIMG}></img></div>
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
export default MainPage