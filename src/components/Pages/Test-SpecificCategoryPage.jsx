import React, { useState, useEffect } from "react";

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

            {users.length === 0 ? <p>No users found in this category.</p> : (
                users.map((user) => (
                    <div key={user.id} style={cardStyle}>
                        <img src={user.profilePicture} alt={user.name} style={imageStyle} />
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                    </div>
                ))
            )}
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

const cardStyle = {
    border: "1px solid #ddd",
    padding: "20px",
    margin: "10px auto",
    width: "300px",
    borderRadius: "10px",
    background: "#f9f9f9"
};

const imageStyle = {
    width: "100px",
    borderRadius: "50%"
};

export default SpecificCategoryPage;
