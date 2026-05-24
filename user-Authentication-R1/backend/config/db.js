const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobspark';

        console.log('Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(mongoURI, {
            // These are no longer required in Mongoose 6+, but good to keep for compatibility if needed
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log('------------------------------------');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📁 Database Name: ${conn.connection.name}`);
        console.log('------------------------------------');
    } catch (error) {
        console.error('------------------------------------');
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('------------------------------------');

        // Exit process with failure
        // process.exit(1);
    }
};

module.exports = connectDB;
