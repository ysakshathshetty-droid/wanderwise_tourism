const express = require("express");
const pool = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET RECOMMENDATIONS
router.post("/", verifyToken, async (req, res) => {
    try {
        const { categories, budget:maxBudget, minRating } = req.body;

        if (
            !Array.isArray(categories) ||
            categories.length === 0 ||
            maxBudget === undefined ||
            minRating === undefined
        ) {
            return res.status(400).json({
                message: "Please provide categories, budget, and minimum rating"
            });
        }

        const budget = Number(maxBudget);
        const rating = Number(minRating);

        if (
            !Number.isFinite(budget) ||
            budget < 0 ||
            !Number.isFinite(rating) ||
            rating < 0 ||
            rating > 5 ||
            categories.some(
                category => typeof category !== "string" || !category.trim()
            )
        ) {
            return res.status(400).json({
                message: "Invalid recommendation preferences"
            });
        }

        const placeholders = categories.map(() => "?").join(", ");

        const sql = `
            SELECT
                destination_id,
                name,
                location,
                type,
                average_rating,
                budget,
                description,
                image_url
            FROM destinations
            WHERE type IN (${placeholders})
              AND budget <= ?
              AND average_rating >= ?
            ORDER BY average_rating DESC, budget ASC
        `;

        const [destinations] = await pool.execute(sql, [
            ...categories,
            budget,
            rating
        ]);

        res.status(200).json({
            count: destinations.length,
            recommendations: destinations
        });

    } catch (error) {
        console.error("Recommendation error:", error);

        res.status(500).json({
            message: "Failed to fetch recommendations"
        });
    }
});

module.exports = router;