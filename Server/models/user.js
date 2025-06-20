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
    blogsId:{
        type: Array,
        default:[{type: mongoose.Schema.Types.ObjectId, ref: "Blog"}]
    },
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
    payment_Id:{
        type: Array,
        default:[{type: mongoose.Schema.Types.ObjectId, ref: "Payment"}]
    },
     otp: String,
    otpExpires: Date,
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);