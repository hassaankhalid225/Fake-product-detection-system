const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ipAddress: { type: String },
    location: { type: String },
    status: { type: String, enum: ['Verified Original Product', 'Fake / Not Found', 'Duplicate Serial Detected'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('VerificationLog', VerificationLogSchema);
