const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Register
router.get("/", (req, res) => {
    res.render("register");
});


//Register form post
router.post("/register", async(req, res) => {
   const { name, email, password, contact, address,image} = req.body;
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
                address
            });
            user.save();
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY);
            res.cookie("token", token);
            res.redirect("/login");
        })
    })
   }
});

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
                const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET_KEY);
                res.cookie("token", token);
                res.redirect("/dashboard");
            }else{
                res.status(400).json({ message: "Incorrect password" });
            }
        })
     }


});
router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});


module.exports = router;