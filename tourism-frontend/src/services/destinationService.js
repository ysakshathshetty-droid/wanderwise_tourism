const API_URL = "http://localhost:5000/api/destinations";

// Fetch all destinations
export const getDestinations = async () => {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch destinations");
    }

    return data;
};

// Fetch one destination by ID
export const getDestinationById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch destination");
    }

    return data;
};