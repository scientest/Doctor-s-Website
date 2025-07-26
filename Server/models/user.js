const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Exclude password from queries by default
    },
    
    image: {
         Data: Buffer,
         ContentType: String
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    blogs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
    Dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
    },
    Bio:{
        type: String,
    },
    Links:{
        type: Array,
        default:[]
    },
    payment_Id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
        default: null
         }],
     otp:{
        type: String,
        select: false, // Exclude otp from queries by default
     },
    otpExpires: {
        type: Date,
        default: Date.now,
        select: false, // Exclude otpExpires from queries by default
    },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 ,select: false}, // Number of attempts for OTP verification
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
});

module.exports = mongoose.model("user", userSchema);