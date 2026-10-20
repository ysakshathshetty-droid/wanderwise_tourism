const express = require("express");
const pool = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET all bookmarks belonging to the logged-in user
router.get("/", verifyToken, async (req, res) => {
    try {
        const [bookmarks] = await pool.execute(
            `SELECT
                b.bookmark_id,
                b.created_at,
                d.destination_id,
                d.name,
                d.location,
                d.type,
                d.average_rating,
                d.budget,
                d.description,
                d.image_url
             FROM bookmarks b
             JOIN destinations d
                ON b.destination_id = d.destination_id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [req.user.userId]
        );

        res.status(200).json(bookmarks);
    } catch (error) {
        console.error("Fetching bookmarks failed:", error);

        res.status(500).json({
            message: "Failed to fetch bookmarks"
        });
    }
});


// CHECK whether a destination is bookmarked
router.get("/:destinationId/status", verifyToken, async (req, res) => {
    try {
        const { destinationId } = req.params;

        const [bookmarks] = await pool.execute(
            `SELECT bookmark_id
             FROM bookmarks
             WHERE user_id = ? AND destination_id = ?`,
            [req.user.userId, destinationId]
        );

        res.status(200).json({
            bookmarked: bookmarks.length > 0
        });
    } catch (error) {
        console.error("Checking bookmark failed:", error);

        res.status(500).json({
            message: "Failed to check bookmark"
        });
    }
});


// ADD BOOKMARK
router.post("/:destinationId", verifyToken, async (req, res) => {
    try {
        const { destinationId } = req.params;

        const [destinations] = await pool.execute(
            `SELECT destination_id
             FROM destinations
             WHERE destination_id = ?`,
            [destinationId]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                message: "Destination not found"
            });
        }

        const [existing] = await pool.execute(
            `SELECT bookmark_id
             FROM bookmarks
             WHERE user_id = ? AND destination_id = ?`,
            [req.user.userId, destinationId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Destination is already bookmarked"
            });
        }

        await pool.execute(
            `INSERT INTO bookmarks (user_id, destination_id)
             VALUES (?, ?)`,
            [req.user.userId, destinationId]
        );

        res.status(201).json({
            message: "Destination added to bookmarks"
        });
    } catch (error) {
        console.error("Adding bookmark failed:", error);

        res.status(500).json({
            message: "Failed to add bookmark"
        });
    }
});


// REMOVE BOOKMARK
router.delete("/:destinationId", verifyToken, async (req, res) => {
    try {
        const { destinationId } = req.params;

        const [result] = await pool.execute(
            `DELETE FROM bookmarks
             WHERE user_id = ? AND destination_id = ?`,
            [req.user.userId, destinationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        res.status(200).json({
            message: "Bookmark removed successfully"
        });
    } catch (error) {
        console.error("Removing bookmark failed:", error);

        res.status(500).json({
            message: "Failed to remove bookmark"
        });
    }
});

module.exports = router;