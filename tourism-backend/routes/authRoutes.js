const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const verifyToken= require("../middleware/authMiddleware");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        const normalizedEmail = email.trim().toLowerCase();

        const [existingUsers] = await pool.execute(
            "SELECT user_id FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await pool.execute(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, 'user')`,
            [name.trim(), normalizedEmail, hashedPassword]
        );


        return res.status(201).json({
            message: "Registration successful,Please login",
           
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Registration failed"
        });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [users] = await pool.execute(
            `SELECT user_id, name, email, password, role
             FROM users
             WHERE email = ?`,
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed"
        });
    }
});

// UPDATE USER PROFILE
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        const [existingUsers] = await pool.execute(
            `SELECT user_id
             FROM users
             WHERE email = ? AND user_id != ?`,
            [cleanEmail, userId]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        await pool.execute(
            `UPDATE users
             SET name = ?, email = ?
             WHERE user_id = ?`,
            [cleanName, cleanEmail, userId]
        );

        const [users] = await pool.execute(
            `SELECT user_id, name, email, role
             FROM users
             WHERE user_id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: users[0]
        });

    } catch (error) {
        console.error("Profile update error:", error);

        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
});

module.exports = router;