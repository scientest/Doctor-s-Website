const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const blogModel = require("../models/blog");
const {varified} =require("../middlewares/SendMail");
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../Controllers/AuthController");
const {jwttoken} = require("../middlewares/jwttoken");
const user = require("../models/user");

//Register
router.get("/", (req, res) => {
    res.status(200).render("home");
});


router.get("/register", (req, res) => {
    res.status(200).render("register");
})


const generateOtp =() => Math.floor(100000 + Math.random() * 900000);
//Register form post
router.post("/register", async(req, res) => {
   const { name, email, password, contact, address,image, Dob} = req.body;
//    console.log(name, email, password, contact, address, image, Dob);
    const otp = generateOtp();
    const otpExpires = Date.now() + 600000;
   const existingUser = await userModel.findOne({ email });
   if(existingUser){
    res.redirect("/login");
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
             res.redirect("/Varify");
        })
    })
   }
});

router.get("/varify", (req, res) => {
    res.render("Varify");
});

router.post("/varify",isLoggedIn,async(req,res)=>{
    const {otp}=req.body;
    const user1 = req.user;
   const existingUser = await userModel.findById(user1._id);
   if(existingUser.otp==otp){
    existingUser.verified=true;
    existingUser.save();
    res.redirect("/login");
   }else{
    res.redirect("/varify");
   }

})



//login
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login",async(req,res)=>{
     const {email,password}=req.body;
     const existingUser =await userModel.findOne({email});
     if(existingUser){
        bcrypt.compare(password,existingUser.password,(err,result)=>{
            if(result){
                const token = jwttoken(existingUser);
                res.cookie("token", token);
                res.redirect("/dashboard/"+existingUser._id);
            }else{
                res.status(400).json({ message: "Incorrect password" });
            }
        })
     }


});
router.get("/dashboard/:id", isLoggedIn,(req, res) => {
    const user1 = req.user;
    res.render("dashboard",{user:user1});
});



router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});


module.exports = router;