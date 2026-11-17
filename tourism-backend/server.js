const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes=require("./routes/authRoutes")
const destinationRoutes=require("./routes/destinationRoutes")
const reviewRoutes=require("./routes/reviewRoutes")
const bookmarksRoutes=require("./routes/bookmarkRoutes")
const recommendationRoutes=require("./routes/recommendationRoutes")
const paymentRoutes=require("./routes/paymentRoutes")
const bookingRoutes=require("./routes/bookingRoutes")

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/destinations",destinationRoutes)
app.use("/api/reviews",reviewRoutes)
app.use("/api/bookmarks",bookmarksRoutes)
app.use("/api/recommendations",recommendationRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/payment",paymentRoutes)
app.use("/api/bookings",bookingRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "WanderWise API is running"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            status: "success",
            message: "MySQL connected successfully"
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: "error",
            message: "MySQL connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});