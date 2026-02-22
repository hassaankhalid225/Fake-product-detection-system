const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Atlas Connection Error:', error.message);
        console.warn('Attempting zero-config in-memory DB fallback...');
        try {
            if (!mongoServer) {
                mongoServer = await MongoMemoryServer.create();
            }
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log(`🚀 In-memory MongoDB connected automatically at: ${uri}`);
        } catch (err) {
            console.error('Failed to start in-memory DB:', err);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
