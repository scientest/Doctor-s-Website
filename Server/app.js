const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const multer = require("multer");
const userRoute = require("./routes/userRoute");
const dbConnect = require("./Database/dbConnect");
const blogModel = require("./models/blog");
const paymentModel = require("./models/payment");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const authRoute = require('./routes/authRoute');
const nodemailer = require("nodemailer");
const twilio = require("twilio");

dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'a_fallback_secret_for_dev_only',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

dbConnect();

app.use("/", userRoute);
app.use('/auth', authRoute);

app.get('/dashboard/:email', (req, res) => {
    const email = req.params.email;
    res.render('dashboard', { email });
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/send-email-otp", async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_ID,
        to: email,
        subject: "Email OTP Verification",
        text: `Your OTP is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send(otp);
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).send("Failed to send OTP to email.");
    }
});

app.post("/send-contact-otp", async (req, res) => {
    const { contact } = req.body;
    const otp = generateOTP();

    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    try {
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: `+91${contact}`,
        });
        res.status(200).send(otp);
    } catch (error) {
        console.error("SMS send error:", error);
        res.status(500).send("Failed to send OTP to contact number.");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});