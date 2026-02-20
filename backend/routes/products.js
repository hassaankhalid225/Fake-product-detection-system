const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { ethers } = require('ethers');
const crypto = require('crypto');
// Assume middleware auth is implemented, skipping for brevity
// const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { productName, serialNumber, batchNumber, manufacturingDate, expiryDate, quantity, description } = req.body;

        let product = await Product.findOne({ serialNumber });
        if (product) return res.status(400).json({ msg: 'Product already registered' });

        const dataString = `${productName}${serialNumber}${batchNumber}${manufacturingDate}${description}`;
        const hash = crypto.createHash('sha256').update(dataString).digest('hex');

        // Here we'd interact with Blockchain to save the hash and get txId
        // Placeholder txId for now
        const blockchainTxId = '0xTxIdFromBlockchainMock';

        product = new Product({
            productName, serialNumber, batchNumber, manufacturingDate, expiryDate, quantity, description,
            hash, blockchainTxId
        });

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
