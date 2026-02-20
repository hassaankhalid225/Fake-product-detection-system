const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        // Attempt standard connection first
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.warn('Standard MongoDB connection failed, attempting zero-config in-memory DB fallback...');
        try {
            if (!mongoServer) {
                mongoServer = await MongoMemoryServer.create();
            }
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log(`In-memory MongoDB connected automatically at: ${uri}`);

            // Auto-seed admin user after memory db starts
            const User = require('./models/User');
            const bcrypt = require('bcrypt');

            const adminExists = await User.findOne({ email: 'admin@verichain.com' });
            if (!adminExists) {
                const hashedPassword = await bcrypt.hash('admin123', 10);
                await User.create({ name: 'Super Admin', email: 'admin@verichain.com', password: hashedPassword, role: 'admin' });
                console.log('✅ Auto-Seeded default Admin -> Email: admin@verichain.com | Password: admin123');
            }

        } catch (err) {
            console.error('Failed to start in-memory DB:', err);
            process.exit(1);
        }
    }
};


app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/verify', require('./routes/verify'));
app.use('/api/analytics', require('./routes/analytics'));

connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch(err => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});
