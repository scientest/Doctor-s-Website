const jwt = require("jsonwebtoken");

const jwttoken = (user)=>{
    return jwt.sign({id:user._id,email:user.email,name:user.name},process.env.JWT_SECRET_KEY);
}

module.exports = {jwttoken};