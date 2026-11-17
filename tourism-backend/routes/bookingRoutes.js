const express = require("express");
const router = express.Router();

const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

// Get upcoming journeys of logged-in user
router.get("/upcoming", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [bookings] = await db.execute(
            `SELECT
                booking_id,
                destination,
                starting_location,
                departure_date,
                return_date,
                days,
                nights,
                travellers,
                total_amount,
                payment_status,
                razorpay_payment_id
             FROM bookings
             WHERE user_id = ?
             AND payment_status = 'PAID'
             AND departure_date >= CURDATE()
             ORDER BY departure_date ASC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (error) {
        console.error("Upcoming bookings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming journeys"
        });
    }
});

module.exports = router;