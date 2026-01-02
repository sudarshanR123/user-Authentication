require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Multer Configuration for Resume Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed!'), false);
        }
    }
});

// --- MongoDB Connection ---
const mongoURI = (process.env.MONGO_URI && process.env.MONGO_URI !== 'undefined')
    ? process.env.MONGO_URI
    : 'mongodb://localhost:27017/jobspark';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('------------------------------------');
        console.log('Connected to MongoDB via URI:', mongoURI);
        console.log('Database Name: jobspark');
        console.log('------------------------------------');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if we can't connect
    });

// --- Mongoose Models ---

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // In production, hash this!
    mobile: { type: String },
    role: { type: String, enum: ['seeker', 'employer', 'none'], default: 'none' },
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

// Job Seeker Profile Schema
const jobSeekerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personalInfo: {
        fullName: { type: String, required: true },
        bio: { type: String },
        experience: { type: String },
        skills: [String]
    },
    resumeUrl: { type: String }, // Placeholder for resume upload path
    contactDetails: {
        phone: { type: String },
        address: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

const JobSeekerProfile = mongoose.model('JobSeekerProfile', jobSeekerSchema);

// Employer Profile Schema
const employerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyInfo: {
        companyName: { type: String, required: true },
        website: { type: String },
        industry: { type: String },
        description: { type: String }
    },
    contactDetails: {
        phone: { type: String },
        address: { type: String },
        email: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

const EmployerProfile = mongoose.model('EmployerProfile', employerSchema);

// --- Routes ---

// --- Profile Routes ---

// Update or Create Job Seeker Profile
app.post('/api/profile/job-seeker', async (req, res) => {
    try {
        const { userId, personalInfo, contactDetails, resumeUrl } = req.body;
        const profile = await JobSeekerProfile.findOneAndUpdate(
            { userId },
            { personalInfo, contactDetails, resumeUrl },
            { upsert: true, new: true }
        );
        // Update user role
        await User.findByIdAndUpdate(userId, { role: 'seeker' });
        res.status(200).json({ success: true, message: "Job seeker profile updated", profile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating job seeker profile", error: error.message });
    }
});

// Resume Upload Route
app.post('/api/profile/upload-resume', upload.single('resume'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        res.json({
            success: true,
            message: "Resume uploaded successfully",
            resumeUrl: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error uploading resume", error: error.message });
    }
});

// Update or Create Employer Profile
app.post('/api/profile/employer', async (req, res) => {
    try {
        const { userId, companyInfo, contactDetails } = req.body;
        const profile = await EmployerProfile.findOneAndUpdate(
            { userId },
            { companyInfo, contactDetails },
            { upsert: true, new: true }
        );
        // Update user role
        await User.findByIdAndUpdate(userId, { role: 'employer' });
        res.status(200).json({ success: true, message: "Employer profile updated", profile });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating employer profile", error: error.message });
    }
});

// Get Profile (Generic)
app.get('/api/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const seekerProfile = await JobSeekerProfile.findOne({ userId });
        if (seekerProfile) return res.json({ success: true, type: 'job-seeker', profile: seekerProfile });

        const employerProfile = await EmployerProfile.findOne({ userId });
        if (employerProfile) return res.json({ success: true, type: 'employer', profile: employerProfile });

        res.status(404).json({ success: false, message: "Profile not found" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// --- Auth Routes ---

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
                userId: user._id,
                username: user.username,
                role: user.role,
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

        // Password Validation (Simplified for testing)
        if (password.length < 5) {
            return res.status(400).json({ success: false, message: "Password must be at least 5 characters long" });
        }
        /* 
        if (!/^[a-zA-Z0-9]+$/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must contain only letters and numbers (no special characters)" });
        }
        if (!/\d/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must contain at least one number" });
        }
        */

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create new user
        const newUser = new User({ email, username, password, mobile, role: req.body.role || 'none' });
        await newUser.save();

        console.log(`[Registration] Success for ${username} (Role: ${req.body.role || 'none'})`);

        res.json({
            success: true,
            message: "User registered successfully",
            userId: newUser._id,
            username: newUser.username,
            role: newUser.role,
            mobile: newUser.mobile
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
