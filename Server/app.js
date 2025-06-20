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
dotenv.config();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("view engine", "ejs");
app.use( express.static( "public"));
app.use(cors());
app.use("/", userRoute);



app.listen(process.env.PORT||3000, () => {
    console.log(`Server is running on port ${process.env.PORT||3000}`);
});