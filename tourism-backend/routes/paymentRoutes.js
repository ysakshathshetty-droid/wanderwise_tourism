const express = require("express");
const router = express.Router();

const Razorpay = require("razorpay");
const crypto = require("crypto");

const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const {
    calculateDistance,
    calculateRegionCentre,
    calculatePackagePrice,
    BENGALURU
} = require("../utils/packagePricing");


// --------------------------------------------------
// RAZORPAY INITIALIZATION
// --------------------------------------------------

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// --------------------------------------------------
// DATE HELPERS
// --------------------------------------------------

function parseDate(value) {

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
        return null;
    }

    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;
}


// --------------------------------------------------
// CREATE RAZORPAY ORDER
// --------------------------------------------------

router.post("/create-order", verifyToken, async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            destination,
            departureDate,
            returnDate,
            travellers,
            minRating
        } = req.body;

        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        const region = String(destination || "").trim();

        const travellerCount = Number(travellers);
        const rating = Number(minRating);

        if (
            !region ||
            region.length > 100 ||
            !departureDate ||
            !returnDate ||
            !Number.isInteger(travellerCount) ||
            travellerCount < 1 ||
            travellerCount > 20 ||
            !Number.isFinite(rating) ||
            rating < 0 ||
            rating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking details."
            });
        }

        const start = parseDate(departureDate);
        const end = parseDate(returnDate);

        if (!start || !end || end < start) {
            return res.status(400).json({
                success: false,
                message: "Invalid travel dates."
            });
        }

        const days = Math.round(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        if (days > 30) {
            return res.status(400).json({
                success: false,
                message: "Trips longer than 30 days are not supported."
            });
        }

        // ------------------------------------------
        // FETCH DESTINATIONS
        // Same query as recommendation route
        // ------------------------------------------

        const sql = `
            SELECT
                destination_id,
                name,
                location,
                type,
                average_rating,
                budget,
                description,
                image_url,
                latitude,
                longitude
            FROM destinations
            WHERE LOWER(location) LIKE LOWER(?)
              AND COALESCE(average_rating, 0) >= ?
            ORDER BY average_rating DESC
        `;

        const [places] = await db.query(sql, [
            `%${region}%`,
            rating
        ]);

        if (!places.length) {
            return res.status(404).json({
                success: false,
                message: "No destinations found for this region."
            });
        }

        // ------------------------------------------
        // CALCULATE REGION CENTRE
        // ------------------------------------------

        const centre = calculateRegionCentre(places);

        if (!centre) {
            return res.status(400).json({
                success: false,
                message: "Destination coordinates are unavailable."
            });
        }

        // ------------------------------------------
        // DISTANCE FROM BENGALURU
        // ------------------------------------------

        const straightLineDistance = calculateDistance(
            BENGALURU.latitude,
            BENGALURU.longitude,
            centre.latitude,
            centre.longitude
        );

        // ------------------------------------------
        // CALCULATE PACKAGE USING SHARED FUNCTION
        // ------------------------------------------

        const packageDetails = calculatePackagePrice(
            straightLineDistance,
            days,
            travellerCount
        );

        // ------------------------------------------
        // CREATE RAZORPAY ORDER
        // ------------------------------------------

        const amountInPaise = packageDetails.total * 100;

        const order = await razorpay.orders.create({

            amount: amountInPaise,
            currency: "INR",
            receipt: `WW_${Date.now()}`

        });

        // ------------------------------------------
        // SAVE PENDING BOOKING
        // ------------------------------------------

        const [result] = await db.query(
            `INSERT INTO bookings
            (
                user_id,
                destination,
                starting_location,
                departure_date,
                return_date,
                days,
                nights,
                travellers,
                destinations,
                total_amount,
                razorpay_order_id,
                payment_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
            [
                userId,
                region,
                "Bengaluru",
                departureDate,
                returnDate,
                days,
                days,
                travellerCount,
                JSON.stringify(places),
                packageDetails.total,
                order.id
            ]
        );

        // ------------------------------------------
        // SEND RESPONSE
        // ------------------------------------------

        return res.status(201).json({

            success: true,

            message: "Payment order created successfully.",

            bookingId: result.insertId,

            key: process.env.RAZORPAY_KEY_ID,

            orderId: order.id,

            amount: order.amount,

            currency: order.currency,

            package: packageDetails

        });

    } catch (error) {

        console.error("Create payment order error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Unable to create payment order."
        });

    }

});


// --------------------------------------------------
// VERIFY PAYMENT
// --------------------------------------------------

router.post("/verify", verifyToken, async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are missing."
            });
        }

        // ------------------------------------------
        // FIND BOOKING
        // ------------------------------------------

        const [bookings] = await db.query(
            `SELECT *
             FROM bookings
             WHERE razorpay_order_id = ?
             AND user_id = ?
             LIMIT 1`,
            [razorpay_order_id, userId]
        );

        if (!bookings.length) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const booking = bookings[0];

        // ------------------------------------------
        // CHECK ALREADY PAID
        // ------------------------------------------

        if (booking.payment_status === "PAID") {

            if (booking.razorpay_payment_id !== razorpay_payment_id) {
                return res.status(400).json({
                    success: false,
                    message: "Payment does not match this booking."
                });
            }

            return res.json({
                success: true,
                bookingId: booking.booking_id,
                paymentId: booking.razorpay_payment_id,
                destination: booking.destination,
                amount: booking.total_amount,
                paymentStatus: "PAID"
            });
        }

        // ------------------------------------------
        // VERIFY SIGNATURE
        // ------------------------------------------

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        const received = Buffer.from(razorpay_signature);
        const expected = Buffer.from(expectedSignature);

        if (
            received.length !== expected.length ||
            !crypto.timingSafeEqual(received, expected)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature."
            });
        }

        // ------------------------------------------
        // VERIFY PAYMENT WITH RAZORPAY
        // ------------------------------------------

        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            payment.order_id !== booking.razorpay_order_id ||
            payment.status !== "captured" ||
            payment.amount !== Math.round(
                Number(booking.total_amount) * 100
            ) ||
            payment.currency !== "INR"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed."
            });
        }

        // ------------------------------------------
        // UPDATE BOOKING
        // ------------------------------------------

        const [updateResult] = await db.query(
            `UPDATE bookings
             SET razorpay_payment_id = ?,
                 payment_status = 'PAID'
             WHERE booking_id = ?
             AND user_id = ?
             AND payment_status = 'PENDING'`,
            [
                razorpay_payment_id,
                booking.booking_id,
                userId
            ]
        );

        if (updateResult.affectedRows !== 1) {
            return res.status(409).json({
                success: false,
                message: "Unable to update booking status."
            });
        }

        return res.json({

            success: true,

            message: "Payment verified successfully.",

            bookingId: booking.booking_id,

            paymentId: razorpay_payment_id,

            destination: booking.destination,

            amount: booking.total_amount,

            paymentStatus: "PAID"

        });

    } catch (error) {

        console.error("Payment verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify payment."
        });

    }

});

module.exports = router;