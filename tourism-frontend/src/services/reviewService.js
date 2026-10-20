const API_URL = "http://localhost:5000/api";

// Fetch reviews
export const getReviews = async (destinationId) => {
    const response = await fetch(
        `${API_URL}/destinations/${destinationId}/reviews`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
    }

    return data;
};

// Submit review
export const addReview = async (reviewData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
    }

    return data;
};