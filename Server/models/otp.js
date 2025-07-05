const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Only one active OTP per email at a time
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpires: {
        type: Date,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Otp', otpSchema);