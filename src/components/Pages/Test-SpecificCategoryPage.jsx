import React, { useState, useEffect } from "react";
import projectMainImage from '../assets/milkAndHoney.png'
import Random from '../assets/Random.png'
import { flushSync } from "react-dom";

const SpecificCategoryPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        fetch("/data.json")
            .then(response => response.json())
            .then(data => {
                const filteredUsers = data.users.filter(user => user.category === selectedCategory);
                setUsers(filteredUsers);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [selectedCategory]);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Filter Users by Category</h2>

            {/* Category Selection Buttons */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setSelectedCategory("developer")} style={buttonStyle}>Developer</button>
                <button onClick={() => setSelectedCategory("designer")} style={buttonStyle}>Designer</button>
                <button onClick={() => setSelectedCategory("manager")} style={buttonStyle}>Manager</button>
            </div>
            <div style={{display: "flex", gap: "20px"}}>
            {users.length === 0 ? <p>No users found in this category.</p> : (
                users.map((user) => (
                    <div style={{display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", position: "relative"}} key={user.id}>
                        <img src={campaign.mainImage} style={{width: "400px", height: "250px"}} alt="projectMainImage"/>
                        <img src={user.profilePicture} style={{width: "60px", height: "60px", borderRadius: "50%"}} alt="userProfileImage"/>
                            <div className="content-container" style={{position: "absolute", top: "260px", left: "70px", display: "flex", flexDirection : "column", alignItems : "start"}}>
                                <p className="project-title" style={{fontSize: "32px"}}>{campaign.title}</p>
                                <p className="user-ID" style={{fontSize: "20px"}}>{user.username}</p>
                            </div>
                            <div className="extra-content-container" style={{fontSize: "24px", position: "absolute", top: "260px", left: "320px", display : "flex", flexDirection: "column", alignItems: "end"}}>
                                <p className="time-remaining">{campaign.daysLeft}</p>
                                <p className="campaign-funded">{campaign.amountGenerated}</p>
                            </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
};

const buttonStyle = {
    margin: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
};

export default SpecificCategoryPage;
