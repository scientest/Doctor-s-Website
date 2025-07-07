const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
const blogModel = require("../models/blog");
const {varified} =require("../middlewares/SendMail");
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../Controllers/AuthController");
const {jwttoken} = require("../middlewares/jwttoken");
const userModel= require("../models/user");


const generateOtp =() => Math.floor(100000 + Math.random() * 900000);
//Register form post
router.post("/register", async(req, res) => {
   const { name, email, password, contact, address,image, Dob} = req.body;
//    console.log(name, email, password, contact, address, image, Dob);
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
     const existingUser =await userModel.findOne({email});
     if(existingUser){
        bcrypt.compare(password,existingUser.password,(err,result)=>{
            if(result){
                const token = jwttoken(existingUser);
                res.cookie("token", token, { httpOnly: true , sameSite: "none",secure: false });
                res.status(200).json({ message: "Login successful",userId:existingUser._id });
            }else{
                res.status(400).json({ message: "Incorrect password" });
            }
        })
     }


});
router.get("/dashboard", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const blog = await blogModel.find().populate("author");
    res.status(200).json( {user:user1,blog});
});

router.post("/blogs/:id", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const { title, description } = req.body;
    const blog = new blogModel({
        title,
        description,
        author:user1._id
    });
    await blog.save();
    user1.blogs.push(blog._id);
    await user1.save();
    res.status(201).json({ message: "Blog created successfully",blog});
});


//edit
router.put("/blogs/edit/:id/:blogId", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const blog = await blogModel.findById(req.params.blogId);
    blog.title = req.body.title;
    blog.description = req.body.description;
    await blog.save();
   res.status(200).json({ message: "Blog updated successfully",blog});
})

//likes
router.put("/blogs/like/:id/:blogId", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const blog = await blogModel.findById(req.params.blogId);
    blog.likes.push(user1._id);
    await blog.save();
    res.status(200).json({ message: "Blog liked successfully",blog});
})

router.delete("/blogs/delete/:id/:blogId", isLoggedIn,async(req, res) => {
    const user1 = req.user;
    const blog = await blogModel.findByIdAndDelete(req.params.blogId);
    user1.blogs.pull(blog._id);
    await user1.save();
    res.status(200).json({ message: "Blog deleted successfully",blog});
})

//Logout ==== 
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});


module.exports = router;