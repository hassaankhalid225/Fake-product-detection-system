const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const VerificationLog = require('../models/VerificationLog');
const crypto = require('crypto');

router.post('/:serialNumber', async (req, res) => {
    try {
        const { serialNumber } = req.params;
        const ipAddress = req.ip || req.connection.remoteAddress;

        let product = await Product.findOne({ serialNumber });
        if (!product) {
            await VerificationLog.create({ serialNumber, ipAddress, status: 'Fake / Not Found' });
            return res.status(404).json({ status: 'Fake / Not Found', msg: 'Product not found in Database' });
        }

        // Checking if already verified numerous times (potential duplicate/fake alert)
        const logsCount = await VerificationLog.countDocuments({ serialNumber });

        if (logsCount > 10) {
            await VerificationLog.create({ serialNumber, productId: product._id, ipAddress, status: 'Duplicate Serial Detected' });
            return res.json({ status: 'Duplicate Serial Detected', count: logsCount, product });
        }

        // Assume blockchain check here: fetch hash from SC
        const blockchainHash = product.hash; // mock check

        // compare hash
        if (product.hash === blockchainHash) {
            await VerificationLog.create({ serialNumber, productId: product._id, ipAddress, status: 'Verified Original Product' });
            return res.json({ status: 'Verified Original Product', product });
        } else {
            await VerificationLog.create({ serialNumber, productId: product._id, ipAddress, status: 'Fake / Not Found' });
            return res.json({ status: 'Fake / Not Found', msg: 'Hash Mismatch' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
