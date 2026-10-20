const express = require("express");
const pool = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ADD REVIEW
router.post("/", verifyToken, async (req, res) => {
    try {
        const { destination_id, rating, comment } = req.body;

        if (
            !Number.isInteger(Number(destination_id)) ||
            Number(destination_id) < 1
        ) {
            return res.status(400).json({
                message: "Invalid destination"
            });
        }

        if (
            rating === undefined ||
            rating === null ||
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        if (typeof comment !== "string" || !comment.trim()) {
            return res.status(400).json({
                message: "Please enter a review comment"
            });
        }

        const [destinations] = await pool.execute(
            "SELECT destination_id FROM destinations WHERE destination_id = ?",
            [Number(destination_id)]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                message: "Destination not found"
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO reviews
                (user_id, destination_id, rating, comment)
             VALUES (?, ?, ?, ?)`,
            [
                req.user.userId,
                Number(destination_id),
                Number(rating),
                comment.trim()
            ]
        );

       const [ratingResult] = await pool.execute(
    `SELECT
        ROUND(AVG(rating), 1) AS average_rating,
        COUNT(*) AS total_reviews
     FROM reviews
     WHERE destination_id = ?`,
    [Number(destination_id)]
   );

   const averageRating = ratingResult[0].average_rating;
   const totalReviews = ratingResult[0].total_reviews;
   
    await pool.execute(
     `UPDATE destinations
     SET average_rating = ?
     WHERE destination_id = ?`,
    [averageRating, Number(destination_id)]
);


        res.status(201).json({
            message: "Review submitted successfully",
            review_id: result.insertId,
            average_rating:averageRating,
            total_reviews:totalReviews
        });

    } catch (error) {
        console.error("Error submitting review:", error);

        res.status(500).json({
            message: "Failed to submit review"
        });
    }
});

// GET reviews written by the logged-in user
router.get("/my-reviews", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [reviews] = await pool.execute(
            `SELECT
                r.review_id,
                r.rating,
                r.comment,
                r.review_date,
                d.destination_id,
                d.name AS destination_name,
                d.location,
                d.image_url
            FROM reviews r
            JOIN destinations d
                ON r.destination_id = d.destination_id
            WHERE r.user_id = ?
            ORDER BY r.review_date DESC`,
            [userId]
        );

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Fetching user reviews failed:", error);

        res.status(500).json({
            message: "Failed to fetch your reviews"
        });
    }
});

module.exports = router;