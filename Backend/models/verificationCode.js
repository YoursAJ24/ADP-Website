const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Ensure uniqueness by email
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Expires after 10 mins
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

module.exports = VerificationCode;
