const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: 'No Google token provided.' });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        if (!email) {
            console.error('Google token payload missing email:', payload);
            return res.status(400).json({ success: false, message: 'Invalid Google token payload: email missing.' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log("Creating new user from Google:", email);
            user = new User({
                name,
                email,
                profilepic: picture,
                googleAuth: true,
                password: 'google_oauth_dummy_password',
                contact: '',
                address: '',
                medicalLicenseNumber: '',
                specialization: '',
                affiliation: '',
                state: '',
                district: '',
                city: '',
                Dob: null,
                experience: 0,
            });

            await user.save();
            console.log("New Google user saved to DB:", user.email);
        } else {
            console.log("👤 Existing Google user login:", email);
            if (user.name !== name || user.profilepic !== picture) {
                user.name = name;
                user.profilepic = picture;
                await user.save();
                console.log("Existing Google user info updated.");
            }
        }

        req.session.userId = user._id;
        req.session.userEmail = user.email;
        req.session.isAuthenticated = true;
        console.log(`Session created for user: ${user.email}, Session ID: ${req.session.id}`);

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully via Google.',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profilepic: user.profilepic,
            }
        });

    } catch (err) {
        console.error('Google login/verification error:', err);
        if (err.code === 'EENOTFOUND') {
            return res.status(503).json({ success: false, message: 'Could not connect to Google verification service.' });
        }
        return res.status(401).json({
            success: false,
            message: 'Google login failed. Invalid or expired token, or other verification issue.',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;