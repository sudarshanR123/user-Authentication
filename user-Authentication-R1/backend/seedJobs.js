require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models (Copied from index.js for standalone execution)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['seeker', 'employer', 'none'], default: 'none' }
});
const User = mongoose.model('User', userSchema);

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

const seedJobs = async () => {
    try {
        console.log("Starting seed script...");
        await connectDB();
        console.log("Connected to database successfully.");

        // 1. Find or Create an Employer
        let employer = await User.findOne({ role: 'employer' });
        if (!employer) {
            console.log("No employer found. Creating a mock employer...");
            employer = new User({
                email: 'employer@test.com',
                username: 'TestEmployer',
                password: 'password123',
                role: 'employer'
            });
            await employer.save();
        }

        console.log(`Using employer: ${employer.username} (${employer._id})`);

        // 2. Clear existing jobs (optional, but good for testing)
        // await Job.deleteMany({});

        // 3. Define 20 jobs
        const jobs = [
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
            { title: "Embedded Systems Engineer", company: "TechTronica", location: "Mysore", salary: "₹12L - ₹18L", type: "Full-time", description: "Develop software for IoT devices and hardware." }
        ];

        // Add employerId to each job
        const jobData = jobs.map(job => ({
            ...job,
            employerId: employer._id,
            requirements: ["Bachelor's degree in relevant field", "Experience in industry", "Strong communication skills"]
        }));

        // 4. Insert into DB
        await Job.insertMany(jobData);

        console.log(`Successfully added ${jobData.length} jobs to the database!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding jobs:", error);
        process.exit(1);
    }
};

seedJobs();
