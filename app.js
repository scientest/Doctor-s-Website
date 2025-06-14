const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const userRoute = require("./routes/userRoute");
dotenv.config();
app.use(express.json());
app.use("public", express.static(path.join(__dirname, "public")));


app.use(cors());
app.use("/user", userRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});