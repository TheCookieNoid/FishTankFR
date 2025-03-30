import { useState, useEffect } from "react";
import fishLogoWhite from '../assets/icon-fish-transpernt.png'
import '../CSS/Checkout.css'
import MainImage from '../assets/Random-1.png'
import UserPhoto from '../assets/Random.png'
import Navbar from '../Navbar'
import { useAuth } from '../../hooks/useAuth'

function Checkout() {
    const { user, loading, handleLogout } = useAuth(true);

    if (loading) {
        return <div>Loading...</div>;
    }

    document.body.style.backgroundColor = "black";
    return (
        <div className="main-container">
            <Navbar user={user} onLogout={handleLogout} />

            <div className="project-details">
                <img src={MainImage} id="project-title" />
                <div className="user-details">
                    <h1>RANDOM-1</h1>
                    <img src={UserPhoto} />
                    <h2>USER-1</h2>
                </div>
            </div>

            <div className="message-container">
                <p>Your pledge will support an ambitious creative project that has yet to be developed. There's a risk that, despite a creator's efforts the project may fail, We urge you to consider this risk prior to pledging. Fishtankfr is not responsible for fraud or refunds.</p>
            </div>

            <div className="price-button-container">
                <h1 style={{ fontWeight: '100' }}>PLEDGE AMOUNT:</h1>
                <button>100</button>
                <button>500</button>
                <button>1000</button>
                <button>2500</button>
            </div>

            <div className="checkout-container">
                <p>Total : ₹</p>
                <button>PLEDGE!</button>
            </div>


        </div>
    )
}

export default Checkout