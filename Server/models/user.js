const mongoose = require('mongoose');

// It's a good practice to ensure Blog and Payment models are defined
// or imported somewhere BEFORE userModel if userModel references them.
// However, Mongoose can handle string refs if the models are registered
// with `mongoose.model()` elsewhere in your app (e.g., in app.js or dbConnect.js).

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        // required: true, // Consider if this is always required for all users
    },
    Dob: {
        type: Date,
        // required: true, // Consider if this is always required for all users
    },

    // Doctor-specific fields (make them NOT required if they can be empty for some users)
    MedicalLicenseNumber: {
        type: String,
        required: false, // Changed from true to false
        unique: true, // Should be unique for doctors
        sparse: true // Allows multiple documents to have a null/undefined value
    },
    licenseFileUrl: { // Assuming 'image' in your request body refers to this
        type: String,
        // required: false // Consider if this is always required for all users
    },
    specialization: {
        type: String,
        required: false // Changed from true to false
    },
    experience: {
        type: Number, // Assuming number of years
        required: false // Changed from true to false
    },
    affiliation: {
        type: String,
        required: false // Changed from true to false
    },
    state: {
        type: String,
        required: false // Changed from true to false
    },
    city: {
        type: String,
        required: false // Changed from true to false
    },
    district: {
        type: String,
        required: false // Changed from true to false
    },

    // Reference fields - ensure Blog and Payment models are registered globally
    blogsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog' // 'Blog' must be a registered Mongoose model
    }],
    payment_Id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment' // 'Payment' must be a registered Mongoose model
    }],

    // OTP and verification fields
    otp: String,
    otpExpires: Date,
    attempts: { type: Number, default: 0 },
    verified: {
        type: Boolean,
        default: false
    },

    // Password Reset fields
    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
    resetPasswordAttempts: { type: Number, default: 0 },

    // Optional: Google Auth flag
    googleAuth: {
        type: Boolean,
        default: false
    }

}, { timestamps: true }); // Adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);
module.exports = User;