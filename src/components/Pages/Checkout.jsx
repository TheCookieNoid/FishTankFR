import { useState, useEffect } from "react";
import fishLogoWhite from '../assets/icon-fish-transpernt.png'
import '../CSS/Checkout.css'

function Checkout(){
    document.body.style.backgroundColor = "black";
    return(
        <div className="main-container">

        <div className="navbar">
            <div className="main-logo">
                <h1 style={{position: 'absolute', left: '20px', top: '0px', color: "white"}}>FISHTANK</h1>
                <p style={{color: "white"}}>FR</p>
                <img src={fishLogoWhite} alt="fishlogoblack"/>
            </div>
            <ul style={{position: 'absolute', left: '700px', top: '85px'}}>
                <li><a style={{color: 'white'}} href="">CAMPAIGNS</a></li>
                <li><a style={{color: 'white'}} href="">ABOUT</a></li>
                <li><a style={{color: 'white'}} href="">EXPLORE</a></li>
            </ul>
        </div>

        </div>
    )
}

export default Checkout