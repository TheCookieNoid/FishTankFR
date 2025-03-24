import React, { useState, useEffect } from "react";
import fishLogoBlack from '../assets/icons-fish.jpg'
import '../CSS/SpecificCategoryPage.css'

function ActualSpecificCategoryPage(){
    return(
    <div className="main-container">

        <div className="navbar">
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
        
    </div>
)
}

export default ActualSpecificCategoryPage