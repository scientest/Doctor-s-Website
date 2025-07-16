const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const userRoute = require("./routes/userRoute");
const dbConnect = require("./Database/dbConnect");
const blogModel = require("./models/blog");
const paymentModel = require("./models/payment");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors( {
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));


app.use("/", userRoute);



app.listen(process.env.PORT||3000, () => {
    console.log(`Server is running on port ${process.env.PORT||3000}`);
});