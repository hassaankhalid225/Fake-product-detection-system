const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables immediately
dotenv.config();

const connectDB = require('./config/db');
const { seedAdmin } = require('./utils/seeder');

const app = express();

// Initialize Database and Seed Admin
const initializeApp = async () => {
    await connectDB();
    await seedAdmin();
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/verify', require('./routes/verify'));
app.use('/api/analytics', require('./routes/analytics'));

// Start Server
initializeApp().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch(err => {
    console.error("Initialization failed:", err);
    process.exit(1);
});
