import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import fishLogoBlack from '../assets/icons-fish.jpg'
import '../CSS/SpecificCategoryPage.css'
import '../jsFiles/dropdown.js'
import { useAuth } from '../../hooks/useAuth'
import Navbar from '../Navbar'

function ActualSpecificCategoryPage() {

    const [users, setUsers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();
    const { user, loading, handleLogout } = useAuth(true);

    useEffect(() => {
        fetch("/data.json")
            .then(response => response.json())
            .then(data => {
                const filteredUsers = data.users.filter(user => user.category === selectedCategory);
                setUsers(filteredUsers);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [selectedCategory]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="main-container">

            <Navbar user={user} onLogout={handleLogout} />

            <h2 className="first-half">YOU ARE VIEWING</h2>
            <div className="dropdown" style={{ position: 'absolute', top: '160px', left: '0px' }}>
                <div className="select">
                    <span className="selected">ARTS</span>
                    <div className="caret"></div>
                </div>
                <ul className="menu">
                    <li className="active" onClick={() => setSelectedCategory("arts")}>ARTS</li>
                    <li onClick={() => setSelectedCategory("crafts")}>CRAFTS</li>
                    <li onClick={() => setSelectedCategory("technology")}>TECHNOLOGY</li>
                    <li onClick={() => setSelectedCategory("fashion")}>FASHION</li>
                    <li onClick={() => setSelectedCategory("film")}>FILM</li>
                    <li onClick={() => setSelectedCategory("music")}>MUSIC</li>
                    <li onClick={() => setSelectedCategory("photography")}>PHOTOGRAPHY</li>
                    <li onClick={() => setSelectedCategory("games")}>GAMES</li>
                </ul>
            </div>
            <h2 className="second-half">CATEGORY</h2>

            <div style={{ display: "flex", gap: "20px", position: "relative", top: "300px", flexWrap: "wrap" }}
                className="campaigns-container"
                onClick={() => navigate(`/campaign/${campaign.id}`)}>
                {users.length === 0 ? <p>No users found in this category.</p> : (
                    users.map((user) => (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", position: "relative" }}
                            key={user.id}>
                            <img src={campaign.mainImage} style={{ width: "400px", height: "250px" }} alt="projectMainImage" />
                            <img src={user.profilePicture} style={{ width: "60px", height: "60px", borderRadius: "50%" }} alt="userProfileImage" />
                            <div className="content-container" style={{ position: "absolute", top: "260px", left: "70px", display: "flex", flexDirection: "column", alignItems: "start" }}>
                                <p className="project-title" style={{ fontSize: "32px" }}>{campaign.title}</p>
                                <p className="user-ID" style={{ fontSize: "20px" }}>{user.username}</p>
                            </div>
                            <div className="extra-content-container" style={{ fontSize: "24px", position: "absolute", top: "260px", left: "320px", display: "flex", flexDirection: "column", alignItems: "end" }}>
                                <p className="time-remaining">{campaign.daysLeft}</p>
                                <p className="campaign-funded">{campaign.amountGenerated}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ActualSpecificCategoryPage