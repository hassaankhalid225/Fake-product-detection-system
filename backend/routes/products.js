const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { getContractInstance } = require('../utils/blockchain');
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

        // Hyperledger Fabric Integration
        let blockchainTxId = 'Placeholder_HLF_Tx';
        const blockchain = await getContractInstance();

        if (blockchain) {
            const { contract, gateway } = blockchain;
            // company name/id can be taken from req.user (if auth is there) or req.body
            const company = req.body.company || 'UnknownCompany';

            await contract.submitTransaction('registerProduct', serialNumber, hash, company);
            await gateway.disconnect();
            blockchainTxId = `HLF_${Date.now()}`; // Custom ID as HLF doesn't return txid directly in some versions easily without more steps
        } else {
            console.log('Blockchain connection failed, proceeding with DB only for now.');
        }

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
