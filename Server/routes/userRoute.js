const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cookieParser = require("cookie-parser");
const blogModel = require("../models/blog");
const {varified} =require("../middlewares/SendMail");
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../Controllers/AuthController");
const {jwttoken} = require("../middlewares/jwttoken");
const userModel= require("../models/user");


const generateOtp =() => Math.floor(100000 + Math.random() * 900000);
//Register form post
router.post("/register",async(req, res) => {
   const { name, email, password, contact, address, Dob} = req.body;
   console.log(name, email, password, contact, address, image, Dob);
    const otp = generateOtp();
    const otpExpires = Date.now() + 600000;
   const existingUser = await userModel.findOne({ email });
   if(existingUser){
    return res.status(400).json({ message: "User already exists. Please login" });
   }else{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            if(err) throw err;
            const user = new userModel({
                name,
                email,
                password:hash,
                contact,
                address,
                Dob,
                otp,
                otpExpires
            });
            user.save();
            const token = jwttoken(user);
            res.cookie("token", token);
            varified(user.email,otp);
             return res.status(201).json({ message: "User registered. otp sent for verification ",userId:user._id});
        })
    })
   }
});

//OTP verification
router.post("/verify", isLoggedIn, async (req, res) => {
    let { otp } = req.body;
    const user1 = req.user;

    if (!otp) {
        return res.status(400).json({ message: "OTP is required" });
    }

    try {
        const existingUser = await userModel.findById(user1._id);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP expired
        if (existingUser.otpExpires < Date.now()) {
            // Regenerate OTP
            const newOtp = generateOtp();
            existingUser.otp = newOtp;
            existingUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            existingUser.attempts = 0; // Reset attempts on resend
            await existingUser.save();

            // Send new OTP to user
            varified(existingUser.email, newOtp);  // assuming this function sends the email

            // req.flash('error', 'OTP expired. A new OTP has been sent to your email.');
            return res.status(400).json({ message: "OTP expired. A new OTP has been sent to your email." });
        }

        // Check if OTP matches
        if (existingUser.otp === otp) {
            existingUser.verified = true;
            existingUser.otp = null;
            existingUser.otpExpires = null;
            existingUser.attempts = 0;
            await existingUser.save();

            return res.status(200).json({ message: "OTP verified successfully" });
        } else {
            // Wrong OTP
            existingUser.attempts = (existingUser.attempts || 0) + 1;

            if (existingUser.attempts >= 3) {
                await userModel.findByIdAndDelete(user1._id);
                // req.flash('error', 'Too many failed attempts. Please register again.');
                return res.status(403).json({ message: "Too many failed attempts. Please register again." });
            } else {
                await existingUser.save();
                // req.flash('error', 'Invalid OTP. Try again.');
                return res.status(401).json({ message: "Invalid OTP. Try again." });
            }
        }

    } catch (err) {
        console.error("OTP Verification Error:", err);
        res.status(500).send("Internal Server Error");
    }
});





//login
// router.get("/login", (req, res) => {
//     res.render("login");
// });

router.post("/login",async(req,res)=>{
     const {email,password}=req.body;
     const existingUser =await userModel.findOne({email}).select("+password");
     if(existingUser){
        bcrypt.compare(password,existingUser.password,(err,result)=>{
            if(result){
                const token = jwttoken(existingUser);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: "Lax", 
                });
                res.status(200).json({ message: "Login successful",userId:existingUser._id });
            }else{
                res.status(400).json({ message: "Incorrect password" });
            }
        })
     }


});
router.get("/dashboard", isLoggedIn,async(req, res) => {
    const user1 = req.userName;
    const userList = await userModel.find().select("name id email");
    const blog = await blogModel.find();
    res.status(200).json( {user:user1,blog,userList, message: "Dashboard loaded successfully" });
});



//Update user profile
router.put("/update", isLoggedIn,upload.single("image"), async (req, res) => {
    const user1 = req.user;
    const { name, email, contact, address } = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(user1._id, { name, email, contact, address, image }, { new: true });
        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
//Get user profile
router.get("/profile", isLoggedIn, async (req, res) => {
    const user1 = req.userId;
    try {
        const userProfile = await userModel.findById(user1).populate("blogs");
        res.status(200).json({ message: "Profile fetched successfully", userProfile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


//follow user
router.put("/follow/:id", isLoggedIn, async (req, res) => {
    const currentId = req.userId;
    const targetedId = req.params.id;
    try {
        const currentuser = await userModel.findById(currentId);
        const targetedUser = await userModel.findById(targetedId);
        if (!currentuser || !targetedUser) {
            return res.status(404).json({ message: "User not found" });
        }else if(currentuser==targetedUser){
            return res.status(400).json({ message: "You cannot follow yourself" });
        }else if(targetedUser.followers.includes(currentId)){
            return res.status(400).json({ message: "You are already following this user" });
        }else{
            currentuser.following.push(targetedId);
            targetedUser.followers.push(currentId);
            await currentuser.save();
            await targetedUser.save();
            res.status(200).json({ message: "Followed successfully", currentuser, targetedUser });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    
});

//unfollow user
router.put("/unfollow/:id", isLoggedIn, async (req, res) => {
    const currentId = req.userId;
    const targetedId = req.params.id;
    try {
        const currentuser = await userModel.findById(currentId);
        const targetedUser = await userModel.findById(targetedId);
        if (!currentuser || !targetedUser) {
            return res.status(404).json({ message: "User not found" });
        }else if(!targetedUser.followers.includes(currentId)){
            return res.status(400).json({ message: "You are not following this user" });
        }else{
            currentuser.following.pull(targetedId);
            targetedUser.followers.pull(currentId);
            await currentuser.save();
            await targetedUser.save();
            res.status(200).json({ message: "Unfollowed successfully", currentuser, targetedUser });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    
});



//Logout ==== 
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});


module.exports = router;