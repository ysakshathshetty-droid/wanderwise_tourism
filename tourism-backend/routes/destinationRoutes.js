const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET all destinations
router.get("/", async (req, res) => {
    try {
        const [destinations] = await pool.execute(
            `SELECT
                destination_id,
                name,
                location,
                type,
                average_rating,
                budget,
                description,
                image_url
             FROM destinations
             ORDER BY destination_id ASC`
        );

        res.status(200).json(destinations);

    } catch (error) {
        console.error("Error fetching destinations:", error);

        res.status(500).json({
            message: "Failed to fetch destinations"
        });
    }
});

// GET destination by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid destination ID"
            });
        }

        const [destinations] = await pool.execute(
            `SELECT
                destination_id,
                name,
                location,
                type,
                average_rating,
                budget,
                description,
                image_url
             FROM destinations
             WHERE destination_id = ?`,
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                message: "Destination not found"
            });
        }

        res.status(200).json(destinations[0]);

    } catch (error) {
        console.error("Error fetching destination:", error);

        res.status(500).json({
            message: "Failed to fetch destination"
        });
    }
});

// GET reviews for a destination
router.get("/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid destination ID"
            });
        }

        const [reviews] = await pool.execute(
            `SELECT
                r.review_id,
                r.user_id,
                r.destination_id,
                r.rating,
                r.comment,
                r.review_date,
                u.name AS user_name
             FROM reviews r
             JOIN users u ON r.user_id = u.user_id
             WHERE r.destination_id = ?
             ORDER BY r.review_date DESC`,
            [id]
        );

        res.status(200).json(reviews);

    } catch (error) {
        console.error("Error fetching reviews:", error);

        res.status(500).json({
            message: "Failed to fetch reviews"
        });
    }
})

module.exports = router;