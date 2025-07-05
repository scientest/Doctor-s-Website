const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI||"mongodb://127.0.0.1:27017/Internship");
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
};

dbConnect();
module.exports = dbConnect;