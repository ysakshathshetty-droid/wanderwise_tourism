const API_URL = "http://localhost:5000/api/auth";

export const signupUser = async (formData) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};
export const updateProfile = async (formData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
    }

    return data;
};