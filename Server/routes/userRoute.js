const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const blogModel = require("../models/blog");
const paymentModel = require("../models/payment");
const { varified, sendOtpForPasswordReset } = require("../middlewares/SendMail");
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../Controllers/AuthController");
const { jwttoken } = require("../middlewares/jwttoken");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

require("../models/blog");
require("../models/payment");

router.get("/", (req, res) => {
    res.status(200).render("home");
});

router.get("/register", (req, res) => {
    res.status(200).render("register");
});

router.post("/register", async (req, res) => {
    const { name, email, password, contact, address, image, Dob, MedicalLicenseNumber, specialization, experience, affiliation, state, city, district } = req.body;

    const otp = generateOtp();
    const otpExpires = Date.now() + 600000;

    try {
        let existingUser = await userModel.findOne({ email });

        if (existingUser) {
            if (!existingUser.verified) {
                existingUser.otp = otp;
                existingUser.otpExpires = otpExpires;
                existingUser.attempts = 0;
                await existingUser.save();
                await varified(existingUser.email, otp);
                return res.redirect("/verify");
            }
            return res.status(409).render("register", { errorMessage: "User already registered and verified. Please log in.", message: '' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            MedicalLicenseNumber,
            licenseFileUrl: image,
            specialization,
            experience,
            affiliation,
            state,
            city,
            district,
            contact,
            address,
            Dob,
            otp,
            otpExpires,
            verified: false,
        });

        await newUser.save();
        const token = jwttoken(newUser);
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        await varified(newUser.email, otp);

        return res.redirect("/verify");

    } catch (saveErr) {
        console.error("Error during registration:", saveErr);
        let errorMessage = "Error registering user. Please try again.";
        if (saveErr.name === 'ValidationError') {
            errorMessage = Object.values(saveErr.errors).map(err => err.message).join(', ');
        }
        return res.status(500).render("register", { errorMessage, message: '' });
    }
});

router.get("/verify", (req, res) => {
    const message = req.query.message || '';
    const errorMessage = req.query.errorMessage || '';
    res.render("Varify", { message, errorMessage });
});

router.post("/verify", isLoggedIn, async (req, res) => {
    const { otp } = req.body;
    const user = req.user;

    if (!user) {
        res.clearCookie("token");
        return res.redirect("/register?errorMessage=Session expired. Please register or log in again.");
    }

    if (!otp) {
        return res.render("Varify", { errorMessage: "Please enter the OTP.", message: '' });
    }

    try {
        const existingUser = await userModel.findById(user._id);
        if (!existingUser) {
            res.clearCookie("token");
            return res.redirect("/register?errorMessage=User not found. Please register again.");
        }

        if (existingUser.otpExpires && existingUser.otpExpires < Date.now()) {
            const newOtp = generateOtp();
            existingUser.otp = newOtp;
            existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
            existingUser.attempts = 0;
            await existingUser.save();

            await varified(existingUser.email, newOtp);
            return res.render("Varify", { errorMessage: "OTP expired. A new OTP has been sent to your email.", message: '' });
        }

        if (existingUser.otp === otp) {
            existingUser.verified = true;
            existingUser.otp = undefined;
            existingUser.otpExpires = undefined;
            existingUser.attempts = 0;
            await existingUser.save();

            const token = jwttoken(existingUser);
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            return res.redirect(`/dashboard/${existingUser._id}`);
        } else {
            existingUser.attempts = (existingUser.attempts || 0) + 1;
            if (existingUser.attempts >= 3) {
                await userModel.findByIdAndDelete(existingUser._id);
                res.clearCookie("token");
                return res.render("register", { errorMessage: "Too many incorrect OTP attempts. Your account has been deleted. Please register again.", message: '' });
            } else {
                await existingUser.save();
                return res.render("Varify", { errorMessage: `Incorrect OTP. Attempts remaining: ${3 - existingUser.attempts}.`, message: '' });
            }
        }
    } catch (err) {
        console.error("OTP Verification Error:", err);
        res.status(500).render("Varify", { errorMessage: "Internal Server Error during OTP verification. Please try again.", message: '' });
    }
});

router.get("/login", (req, res) => {
    const message = req.query.message || '';
    const errorMessage = req.query.errorMessage || '';
    res.render("login", { message, errorMessage });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return res.status(400).render("login", { errorMessage: "Invalid email or password.", message: '' });
        }

        if (!existingUser.verified) {
            return res.status(403).redirect(`/verify?errorMessage=${encodeURIComponent("Account not verified. Please verify your email.")}`);
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (isMatch) {
            const token = jwttoken(existingUser);
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.redirect("/dashboard/" + existingUser._id);
        } else {
            return res.status(400).render("login", { errorMessage: "Invalid email or password.", message: '' });
        }
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).render("login", { errorMessage: "Internal Server Error. Please try again.", message: '' });
    }
});

router.get("/dashboard/:id", isLoggedIn, async (req, res) => {
    const user = req.user;

    if (!user || user._id.toString() !== req.params.id) {
        res.clearCookie("token");
        return res.redirect("/login?errorMessage=Unauthorized access or session expired.");
    }

    if (!user.verified) {
        res.clearCookie("token");
        return res.redirect("/login?errorMessage=Account not verified. Please log in and verify.");
    }

    const fullUser = await userModel.findById(user._id);

    res.render("dashboard", { user: fullUser });
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    if (req.session) {
        req.session.destroy((err) => {
            if (err) console.error("Error destroying session on logout:", err);
            res.redirect("/login?message=You have been logged out successfully.");
        });
    } else {
        res.redirect("/login?message=You have been logged out successfully.");
    }
});

router.get('/forgot-password', (req, res) => {
    const message = req.query.message || '';
    const errorMessage = req.query.errorMessage || '';
    res.render('forgot-password', { message, errorMessage });
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ errorMessage: 'Email is required.' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            console.log(`Password reset OTP requested for non-existent email: ${email}`);
            return res.redirect(`/verify-reset-otp?message=${encodeURIComponent('If an account with that email exists, an OTP has been sent.')}`);
        }

        if (user.googleAuth && !user.password) {
            return res.status(400).json({ errorMessage: 'This account uses Google Sign-in. Please log in with Google.' });
        }

        const otp = generateOtp();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = otpExpires;
        user.resetPasswordAttempts = 0;
        await user.save();

        await sendOtpForPasswordReset(user.email, otp);

        // Ensure these session variables are set before redirecting
        req.session.resettingUserId = user._id.toString();
        req.session.canResetPassword = false; // Initially false, set to true after OTP verification

        // IMPORTANT: Ensure the session is saved before redirecting if using a session store
        req.session.save((err) => {
            if (err) console.error("Error saving session after forgot-password:", err);
            return res.redirect(`/verify-reset-otp?message=${encodeURIComponent('An OTP has been sent to your email. Please check your inbox.')}`);
        });

    } catch (error) {
        console.error("Error sending reset OTP:", error);
        let errorMessage = 'Failed to send OTP. Please try again later.';
        if (error.name === 'ValidationError') {
            errorMessage = `Validation failed: ${Object.values(error.errors).map(err => err.message).join(', ')}`;
        }
        return res.status(500).json({ errorMessage: errorMessage });
    }
});

router.get('/verify-reset-otp', (req, res) => {
    const message = req.query.message || '';
    const errorMessage = req.query.errorMessage || '';
    res.render('verify-reset-otp', { message, errorMessage });
});

router.post('/verify-reset-otp', async (req, res) => {
    const { otp } = req.body;
    const userId = req.session.resettingUserId; // Retrieve userId from session

    if (!userId) {
        // If userId is missing from session, something went wrong earlier or session expired
        return res.status(400).json({ errorMessage: 'Session data missing. Please restart the password reset process.', redirectUrl: '/forgot-password' });
    }
    if (!otp) {
        return res.status(400).json({ errorMessage: 'Please enter the OTP.' });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            req.session.destroy((err) => {
                if (err) console.error("Error destroying session (user not found):", err);
                // Redirect to forgot-password if user somehow vanishes
                return res.status(404).json({ errorMessage: 'User not found. Please restart the process.', redirectUrl: '/forgot-password' });
            });
            return;
        }

        // Check for OTP expiry
        if (!user.resetPasswordOtpExpires || user.resetPasswordOtpExpires < Date.now()) {
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpires = undefined;
            user.resetPasswordAttempts = 0;
            await user.save();

            req.session.destroy((err) => {
                if (err) console.error("Error destroying session (OTP expired):", err);
                return res.status(400).json({ errorMessage: 'OTP expired. Please request a new OTP.', redirectUrl: '/forgot-password' });
            });
            return;
        }

        // Verify OTP
        if (user.resetPasswordOtp === otp) {
            req.session.canResetPassword = true; // Set flag to allow password reset
            req.session.resettingUserId = user._id.toString(); // Re-confirm userId in session

            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpires = undefined;
            user.resetPasswordAttempts = 0;
            await user.save();

            // IMPORTANT: Save session explicitly before sending response
            req.session.save((err) => {
                if (err) console.error("Error saving session after successful OTP verification:", err);
                return res.json({ success: true, message: 'OTP Verified Successfully!', redirectUrl: '/reset-password' });
            });

        } else {
            // Incorrect OTP
            user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;

            if (user.resetPasswordAttempts >= 3) {
                user.resetPasswordOtp = undefined;
                user.resetPasswordOtpExpires = undefined;
                user.resetPasswordAttempts = 0;
                await user.save();

                req.session.destroy((err) => {
                    if (err) console.error("Error destroying session (too many attempts):", err);
                    return res.status(400).json({ errorMessage: 'Too many incorrect OTP attempts. Please request a new OTP.', redirectUrl: '/forgot-password' });
                });
                return;
            }

            await user.save();
            return res.status(400).json({ errorMessage: `Incorrect OTP. Attempts remaining: ${3 - user.resetPasswordAttempts}.` });
        }

    } catch (error) {
        console.error("Error verifying reset OTP:", error);
        return res.status(500).json({ errorMessage: 'Internal server error. Please try again.', redirectUrl: '/forgot-password' });
    }
});

router.get('/reset-password', (req, res) => {
    // This check is crucial for authorization
    if (!req.session.canResetPassword || !req.session.resettingUserId) {
        // If session flags are missing, redirect to restart the process
        return res.redirect('/forgot-password?errorMessage=Unauthorized access. Please restart the password reset process.');
    }
    const message = req.query.message || '';
    const errorMessage = req.query.errorMessage || '';
    res.render('reset-password', { message, errorMessage });
});

router.post('/reset-password', async (req, res) => {
    const { password, confirmPassword } = req.body;
    const userId = req.session.resettingUserId;

    if (!req.session.canResetPassword || !userId) {
        req.session.destroy((err) => {
            if (err) console.error("Error destroying session on unauthorized reset attempt:", err);
            return res.status(403).json({ errorMessage: 'Unauthorized reset attempt. Please start over.', redirectUrl: '/login' });
        });
        return;
    }

    if (!password || password.length < 8) {
        return res.status(400).json({ errorMessage: 'Password must be at least 8 characters long.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ errorMessage: 'Passwords do not match.' });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            req.session.destroy((err) => {
                if (err) console.error("Error destroying session (user not found during reset):", err);
                return res.status(400).json({ errorMessage: 'User not found. Please try the reset process again.', redirectUrl: '/login' });
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        req.session.destroy((err) => {
            if (err) console.error("Error destroying session on successful reset:", err);
            return res.status(200).json({ message: 'Password reset successfully. Redirecting to login.' });
        });

    } catch (error) {
        console.error("Password reset error:", error);
        req.session.destroy((err) => {
            if (err) console.error("Error destroying session after reset error:", err);
            return res.status(500).json({ errorMessage: 'Failed to reset password due to a server error. Please try again.' });
        });
    }
});

module.exports = router;