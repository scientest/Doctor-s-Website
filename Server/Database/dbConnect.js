const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
};

dbConnect();
module.exports = dbConnect;