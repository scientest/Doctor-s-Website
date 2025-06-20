const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
router.use(cookieParser());

const isLoggedIn =async(req,res,next)=>{
    const token = req.cookies.token;
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.id);
        if(user){
            req.user = user;
            next();
        }else{
            res.status(401).redirect("/login");
        }
    }
    else{
        res.status(401).redirect("/login");
    }
}

module.exports = {isLoggedIn};