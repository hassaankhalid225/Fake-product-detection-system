const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const VerificationLog = require('../models/VerificationLog');

// Get overview stats
router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalVerifications = await VerificationLog.countDocuments();
        const fakeAttempts = await VerificationLog.countDocuments({ status: { $ne: 'Verified Original Product' } });

        // recent logs
        const recentLogs = await VerificationLog.find().sort({ createdAt: -1 }).limit(10).populate('productId', 'productName');

        res.json({ totalProducts, totalVerifications, fakeAttempts, recentLogs });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
