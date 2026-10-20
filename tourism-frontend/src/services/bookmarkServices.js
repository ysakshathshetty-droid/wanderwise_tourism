const API_URL = "http://localhost:5000/api/bookmarks";

const getToken = () => {
    return localStorage.getItem("token");
};


// GET ALL BOOKMARKS
export const getBookmarks = async () => {
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookmarks");
    }

    return data;
};


// CHECK BOOKMARK STATUS
export const isBookmarked = async (destinationId) => {
    const response = await fetch(
        `${API_URL}/${destinationId}/status`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to check bookmark");
    }

    return data.bookmarked;
};


// ADD BOOKMARK
export const addBookmark = async (destinationId) => {
    const response = await fetch(
        `${API_URL}/${destinationId}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to add bookmark");
    }

    return data;
};


// REMOVE BOOKMARK
export const removeBookmark = async (destinationId) => {
    const response = await fetch(
        `${API_URL}/${destinationId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to remove bookmark");
    }

    return data;
};