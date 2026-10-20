const API_URL = "http://localhost:5000/api/reviews";

export const getMyReviews = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/my-reviews`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
    }

    return data;
};