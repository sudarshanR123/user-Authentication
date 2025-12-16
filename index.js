require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Models ---

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // In production, hash this!
    mobile: { type: String },
    googleId: { type: String } // For Google Auth
});

const User = mongoose.model('User', userSchema);

// OTP Schema (User <-> Code)
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // 300 seconds = 5 minutes
});

const Otp = mongoose.model('Otp', otpSchema);

// --- Routes ---

// 1. Login API
// Method: POST
app.post('/api/auth/login', async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Find user by email OR username
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (user && user.password === password) {
            res.json({
                success: true,
                message: "Login successful",
                user: { id: user._id, email: user.email, username: user.username },
                token: "mock-jwt-token-12345"
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// 2. Google Login API
app.post('/api/auth/google', async (req, res) => {
    res.json({ success: true, message: "Google login successful", token: "mock-google-session-token" });
});

// 3. Register API
// Method: POST
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, username, password, mobile } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create new user
        const newUser = new User({ email, username, password, mobile });
        await newUser.save();

        res.json({
            success: true,
            message: "User registered successfully",
            user: { id: newUser._id, email: newUser.email, username: newUser.username, mobile: newUser.mobile }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// 4. Forgot Password API
// Method: POST
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB (upsert: update if exists, insert if new)
        await Otp.findOneAndUpdate(
            { email },
            { code, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        console.log(`[Mock Email Service] OTP for ${email}: ${code}`);

        res.json({
            success: true,
            message: "OTP sent to your email",
            debug_code: code
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// 5. Verify Code API
// Method: POST
app.post('/api/auth/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;

        const otpRecord = await Otp.findOne({ email });

        // Allow "123456" as magic code OR check DB
        if ((otpRecord && otpRecord.code === code) || code === "123456") {
            res.json({
                success: true,
                message: "OTP verified successfully",
                resetToken: "temp-reset-token-for-" + email
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// 6. Reset Password API (Combined Verify + Reset)
// Method: POST
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        // 1. Verify OTP
        const otpRecord = await Otp.findOne({ email });

        // Allow "123456" as magic code OR check DB
        const isValidOtp = (otpRecord && otpRecord.code === code) || code === "123456";

        if (!isValidOtp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 3. Update password
        user.password = newPassword;
        await user.save();

        // 4. Delete OTP
        if (otpRecord) await Otp.deleteOne({ email });

        res.json({
            success: true,
            message: "Password reset successfully. You can now login."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
