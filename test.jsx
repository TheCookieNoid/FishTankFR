import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CampaignDetails() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        fetch("/data.json")
            .then(response => response.json())
            .then(data => {
                const selectedCampaign = data.users.find(c => c.id === parseInt(id));
                setCampaign(selectedCampaign);
            })
            .catch(error => console.error("Error fetching campaign:", error));
    }, [id]);

    if (!campaign) return <p>Loading campaign details...</p>;

    return (
        <div className="campaign-details">
            <h1>{campaign.title}</h1>
            <img src={campaign.mainImage} alt="Campaign Main" style={{ width: "600px", height: "350px" }} />
            <p>Created by: {campaign.username}</p>
            <p>Funds Raised: ${campaign.amountGenerated}</p>
            <p>Days Left: {campaign.daysLeft}</p>
            <p>Description: {campaign.description}</p>
        </div>
    );
}

export default CampaignDetails;
