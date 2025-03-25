import React, { useState, useEffect } from "react";
import fishLogoBlack from '../assets/icons-fish.jpg'
import '../CSS/SpecificCategoryPage.css'
import '../jsFiles/dropdown.js'

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

        <h2 className="first-half">YOU ARE VIEWING</h2>
        <div className="dropdown">
            <div className="select">
                <span className="selected">ARTS</span>
                <div className="caret"></div>
            </div>
            <ul className="menu">
                <li className="active">ARTS</li>
                <li>CRAFTS</li>
                <li>TECHNOLOGY</li>
                <li>FASHION</li>
                <li>FILM</li>
                <li>MUSIC</li>
                <li>PHOTOGRAPHY</li>
                <li>GAMES</li>
            </ul>
        </div>
        <h2 className="second-half">CATEGORY</h2>
        
    </div>
)
}

export default ActualSpecificCategoryPage