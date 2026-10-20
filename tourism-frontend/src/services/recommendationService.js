const API_URL = "http://localhost:5000/api/recommendations";

export const getRecommendations = async (preferences) => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch recommendations"
        );
    }

    return data.recommendations;
};