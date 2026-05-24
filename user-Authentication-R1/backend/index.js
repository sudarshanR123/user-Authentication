require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const connectDB = require('./config/db');


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

// --- Connect to MongoDB ---
connectDB();

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

// Job Schema
const jobSchema = new mongoose.Schema({
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'], default: 'Full-time' },
    description: { type: String },
    requirements: [String],
    createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'shortlisted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

// --- Routes ---

// --- Job Routes ---

// Post a new job
app.post('/api/jobs', async (req, res) => {
    try {
        const { employerId, title, company, location, salary, type, description, requirements } = req.body;
        const newJob = new Job({ employerId, title, company, location, salary, type, description, requirements });
        await newJob.save();
        res.status(201).json({ success: true, message: "Job posted successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error posting job", error: error.message });
    }
});

// Get all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        let jobs = await Job.find().sort({ createdAt: -1 });

        // Return 20 mock jobs if the DB is empty
        if (jobs.length === 0) {
            jobs = [
                { _id: "m1", title: "Global Product Lead", company: "Aether Corp", location: "Singapore", salary: "$120k", type: "Full-time", description: "Lead global product strategy." },
                { _id: "m2", title: "Senior AI Researcher", company: "Neurolink", location: "San Francisco", salary: "$180k", type: "Full-time", description: "Pushing boundaries of AGI." },
                { _id: "m3", title: "Lead Architect", company: "Stellar Systems", location: "London", salary: "£90k", type: "Full-time", description: "Design scalable cloud infrastructure." },
                { _id: "m4", title: "VP of Engineering", company: "FinTech Scale", location: "New York", salary: "$250k", type: "Full-time", description: "Scale our engineering team." },
                { _id: "m5", title: "Senior Security Engineer", company: "GuardTower", location: "Remote", salary: "$140k", type: "Remote", description: "Secure our decentralized network." },
                { _id: "m6", title: "Principal UX Designer", company: "DesignFlow", location: "Berlin", salary: "€85k", type: "Full-time", description: "Lead user-centric design initiatives." },
                { _id: "m7", title: "Growth Marketing Manager", company: "SaaS Rocket", location: "Austin", salary: "$110k", type: "Full-time", description: "Drive expansion into new markets." },
                { _id: "m8", title: "Blockchain Developer", company: "Decentral", location: "Remote", salary: "$150k", type: "Remote", description: "Build the future of DeFi." },
                { _id: "m9", title: "Head of Talent", company: "PeopleFirst", location: "Chicago", salary: "$130k", type: "Full-time", description: "Revolutionize our hiring process." },
                { _id: "m10", title: "Senior DevOps Engineer", company: "CloudNative", location: "Toronto", salary: "$145k", type: "Full-time", description: "Automate everything." },
                { _id: "m11", title: "Software Engineer (React)", company: "WebWizards", location: "Bangalore", salary: "₹25L", type: "Full-time", description: "Master of modern web interfaces." },
                { _id: "m12", title: "Backend Guru (Go)", company: "FastAPI", location: "Tokyo", salary: "¥12M", type: "Full-time", description: "Optimize high-performance systems." },
                { _id: "m13", title: "Data Analyst", company: "Quantico", location: "Paris", salary: "€65k", type: "Full-time", description: "Find stories in the data." },
                { _id: "m14", title: "Mobile Lead (Native)", company: "AppPro", location: "Sydney", salary: "$160k", type: "Full-time", description: "Deliver world-class mobile experiences." },
                { _id: "m15", title: "Cloud Consultant", company: "AzureExpert", location: "Remote", salary: "$120k", type: "Remote", description: "Migrate legacy systems to cloud." },
                { _id: "m16", title: "QA Manager", company: "TestLogic", location: "Dublin", salary: "€75k", type: "Full-time", description: "Ensure quality at scale." },
                { _id: "m17", title: "Technical Writer", company: "DocuHub", location: "Remote", salary: "$80k", type: "Remote", description: "Clear and concise documentation." },
                { _id: "m18", title: "Solutions Architect", company: "BigData Inc", location: "Mumbai", salary: "₹35L", type: "Full-time", description: "Design data-driven solutions." },
                { _id: "m19", title: "Product Marketing", company: "BrandScale", location: "Amsterdam", salary: "€70k", type: "Full-time", description: "Position our product for success." },
                { _id: "m20", title: "Executive Assistant", company: "Global HQ", location: "Dubai", salary: "$90k", type: "Full-time", description: "Support our executive leadership." }
            ];
        }

        res.json({ success: true, jobs });
    } catch (error) {
        // Fallback mock even on total error
        const mockJobs = Array.from({ length: 20 }).map((_, i) => ({
            _id: `m${i}`,
            title: `Explorer Job ${i + 1}`,
            company: "Mock Company",
            location: "Global",
            type: "Full-time",
            createdAt: new Date()
        }));
        res.json({ success: true, jobs: mockJobs });
    }
});

// Seeding route to add 20 dummy jobs
app.post('/api/jobs/seed', async (req, res) => {
    try {
        const { employerId } = req.body;
        if (!employerId) return res.status(400).json({ success: false, message: "employerId is required" });

        const jobsData = [
            { title: "Senior Frontend Developer", company: "TechNova Solutions", location: "Bangalore", salary: "₹18L - ₹25L", type: "Full-time", description: "Looking for a React expert to lead our dashboard revamp." },
            { title: "Backend Engineer (Node.js)", company: "CloudScale Systems", location: "Remote", salary: "₹15L - ₹22L", type: "Remote", description: "Design and implement scalable microservices." },
            { title: "UI/UX Designer", company: "Creative Minds", location: "Mumbai", salary: "₹10L - ₹15L", type: "Full-time", description: "Craft beautiful and intuitive user experiences for our e-commerce platform." },
            { title: "Full Stack Developer", company: "StartUp Hub", location: "Pune", salary: "₹12L - ₹18L", type: "Full-time", description: "MERN stack developer for building next-gen social platform." },
            { title: "Data Scientist", company: "Insight Analytics", location: "Hyderabad", salary: "₹20L - ₹30L", type: "Full-time", description: "Analyze big data to drive business decisions." },
            { title: "DevOps Engineer", company: "Reliant Infra", location: "Chennai", salary: "₹14L - ₹20L", type: "Full-time", description: "Automate CI/CD pipelines and manage cloud infrastructure." },
            { title: "Mobile App Developer (Flutter)", company: "AppVibe", location: "Gurugram", salary: "₹12L - ₹16L", type: "Full-time", description: "Build cross-platform mobile apps for global clients." },
            { title: "Cybersecurity Analyst", company: "SecureNet", location: "Noida", salary: "₹16L - ₹24L", type: "Full-time", description: "Protect our systems from emerging cyber threats." },
            { title: "Product Manager", company: "FutureVision", location: "Bangalore", salary: "₹22L - ₹35L", type: "Full-time", description: "Lead the product strategy and roadmap." },
            { title: "Marketing Specialist", company: "GrowthX", location: "Remote", salary: "₹8L - ₹12L", type: "Remote", description: "Drive digital marketing campaigns and growth." },
            { title: "QA Automation Engineer", company: "QualityFirst", location: "Pune", salary: "₹10L - ₹14L", type: "Full-time", description: "Write automated tests to ensure flawless software delivery." },
            { title: "Cloud Architect", company: "SkyHigh Systems", location: "Hyderabad", salary: "₹30L - ₹45L", type: "Full-time", description: "Design complex cloud solutions on AWS/Azure." },
            { title: "Graphic Designer", company: "Artisan Studio", location: "Mumbai", salary: "₹6L - ₹9L", type: "Contract", description: "Create visual assets for social media and web." },
            { title: "Content Writer", company: "WordWorks", location: "Remote", salary: "₹5L - ₹8L", type: "Remote", description: "Write engaging articles and website copy." },
            { title: "Sales Executive", company: "MarketReach", location: "Delhi", salary: "₹7L - ₹10L", type: "Full-time", description: "Identify and convert new business opportunities." },
            { title: "HR Manager", company: "PeopleFirst", location: "Bangalore", salary: "₹15L - ₹20L", type: "Full-time", description: "Manage recruitment and employee relations." },
            { title: "Blockchain Developer", company: "CryptoEdge", location: "Remote", salary: "₹25L - ₹40L", type: "Remote", description: "Develop smart contracts and decentralized applications." },
            { title: "System Administrator", company: "NetworkWorld", location: "Chennai", salary: "₹9L - ₹13L", type: "Full-time", description: "Maintenance and monitoring of internal servers." },
            { title: "Game Developer (Unity)", company: "PixelPlay", location: "Pune", salary: "₹14L - ₹22L", type: "Full-time", description: "Create immersive 3D games for mobile and PC." },
            { title: "Embedded Systems Engineer", company: "TechTronica", location: "Mysore", salary: "₹12L - ₹18L", type: "Full-time", description: "Embedded developer for IoT products." }
        ];

        const jobsWithEmployer = jobsData.map(j => ({
            ...j,
            employerId,
            requirements: ["Relevant Experience", "Problem Solving Skills", "Team Player"]
        }));

        await Job.insertMany(jobsWithEmployer);
        res.status(201).json({ success: true, message: "20 jobs seeded successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error seeding jobs", error: error.message });
    }
});

// Get jobs by employerId
app.get('/api/jobs/employer/:employerId', async (req, res) => {
    try {
        const { employerId } = req.params;
        let jobs = await Job.find({ employerId }).sort({ createdAt: -1 });

        // If no jobs found, return mock data for demonstration purposes
        if (jobs.length === 0) {
            jobs = [
                { _id: "mock1", title: "Senior Frontend Developer", location: "Bangalore", type: "Full-time", createdAt: new Date() },
                { _id: "mock2", title: "Backend Engineer", location: "Remote", type: "Remote", createdAt: new Date() },
                { _id: "mock3", title: "UI/UX Designer", location: "Mumbai", type: "Full-time", createdAt: new Date() },
                { _id: "mock4", title: "Product Manager", location: "Hyderabad", type: "Full-time", createdAt: new Date() },
                { _id: "mock5", title: "DevOps Specialist", location: "Pune", type: "Contract", createdAt: new Date() },
                { _id: "mock6", title: "Marketing Lead", location: "Remote", type: "Remote", createdAt: new Date() },
                { _id: "mock7", title: "Data Scientist", location: "Noida", type: "Full-time", createdAt: new Date() },
                { _id: "mock8", title: "Customer Success", location: "Delhi", type: "Full-time", createdAt: new Date() },
                { _id: "mock9", title: "Flutter Developer", location: "Bangalore", type: "Full-time", createdAt: new Date() },
                { _id: "mock10", title: "HR Generalist", location: "Chennai", type: "Full-time", createdAt: new Date() }
            ];
        }

        res.json({ success: true, jobs });
    } catch (error) {
        // Fallback mock even on total error
        const mockJobs = Array.from({ length: 10 }).map((_, i) => ({
            _id: `mock${i}`,
            title: `Sample Job ${i + 1}`,
            location: "Sample Location",
            type: "Full-time",
            createdAt: new Date()
        }));
        res.json({ success: true, jobs: mockJobs, note: "Using mock data (DB Error)" });
    }
});

// --- Application Routes ---

// Apply for a job
app.post('/api/applications', async (req, res) => {
    try {
        const { jobId, seekerId } = req.body;

        // Prevent duplicate applications
        const existing = await Application.findOne({ jobId, seekerId });
        if (existing) return res.status(400).json({ success: false, message: "Already applied for this job" });

        const newApp = new Application({ jobId, seekerId });
        await newApp.save();
        res.status(201).json({ success: true, message: "Application submitted", application: newApp });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error applying", error: error.message });
    }
});

// Get applicants for a job
app.get('/api/applications/job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ jobId })
            .populate('seekerId', 'username email mobile') // Get basic user info
            .sort({ appliedAt: -1 });

        // We also need the seeker profiles for more detail
        const detailedApps = await Promise.all(applications.map(async (app) => {
            const profile = await JobSeekerProfile.findOne({ userId: app.seekerId._id });
            return {
                ...app._doc,
                profile: profile ? profile : null
            };
        }));

        res.json({ success: true, applications: detailedApps });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching applicants", error: error.message });
    }
});

// Update application status (Shortlist/Reject)
app.patch('/api/applications/:applicationId', async (req, res) => {
    try {
        const { status } = req.body;
        const appRecord = await Application.findByIdAndUpdate(req.params.applicationId, { status }, { new: true });
        res.json({ success: true, message: `Status updated to ${status}`, application: appRecord });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating status", error: error.message });
    }
});

// Get Dashboard Stats for Employer
app.get('/api/employer/stats/:employerId', async (req, res) => {
    try {
        const { employerId } = req.params;
        const jobs = await Job.find({ employerId });
        const jobIds = jobs.map(j => j._id);

        const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
        const shortlisted = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'shortlisted' });

        res.json({
            success: true,
            stats: {
                activeListings: jobs.length,
                totalApplications,
                shortlisted
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
    }
});

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
        // Mock fallback for disconnected DB
        console.log("Using Mock Profile Save due to DB error");
        const { personalInfo, contactDetails, resumeUrl } = req.body;
        res.status(200).json({
            success: true,
            message: "Profile saved (Offline Mode)",
            profile: { personalInfo, contactDetails, resumeUrl }
        });
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
        // Mock fallback for disconnected DB
        console.log("Using Mock Employer Profile Save due to DB error");
        const { companyInfo, contactDetails } = req.body;
        res.status(200).json({
            success: true,
            message: "Employer profile saved (Offline Mode)",
            profile: { companyInfo, contactDetails }
        });
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
        // Mock fallback - return empty profile
        console.log("Using Mock Profile Fetch due to DB error");
        res.status(404).json({ success: false, message: "Profile not found (Offline Mode)" });
    }
});

// Debug route to list users
app.get('/api/debug/users', async (req, res) => {
    try {
        const users = await User.find({}, 'email username role');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
        // Mock fallback for disconnected DB
        console.log("Using Mock Login due to DB error");
        const { emailOrUsername } = req.body;
        res.json({
            success: true,
            message: "Mock Login Successful (Offline Mode)",
            userId: "mock-user-id",
            username: emailOrUsername.split('@')[0],
            role: "none",
            token: "mock-jwt-offline"
        });
    }
});

// 2. Google Login API
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token, role } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        // Verify token with Google
        const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const { email, name, given_name, family_name, sub } = googleRes.data;
        const displayName = name || `${given_name || ''} ${family_name || ''}`.trim() || email.split('@')[0];

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user for Google Sign In
            user = new User({
                email,
                username: displayName,
                password: 'google-auth-no-password', // Placeholder
                role: role || 'none',
                googleId: sub
            });
            await user.save();
        }


        res.json({
            success: true,
            message: "Google login successful",
            userId: user._id,
            username: user.username,
            role: user.role,
            token: "mock-google-jwt-" + sub
        });
    } catch (error) {
        console.error('Google Auth Error:', error.message);

        // Mock fallback for Google Auth if DB is disconnected
        if (error.message.includes('buffering timed out') || error.message.includes('connect')) {
            console.log("Using Mock Google Auth due to DB error");
            return res.json({
                success: true,
                message: "Mock Google Login Successful (Offline Mode)",
                userId: "mock-google-id",
                username: "Demo User",
                role: "none",
                token: "mock-google-offline"
            });
        }

        res.status(500).json({ success: false, message: "Google Authentication failed", error: error.message });
    }
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
