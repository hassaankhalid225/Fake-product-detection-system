const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    batchNumber: { type: String, required: true },
    manufacturingDate: { type: Date, required: true },
    expiryDate: { type: Date },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    hash: { type: String, required: true },
    blockchainTxId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
