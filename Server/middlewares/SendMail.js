const nodemailer = require('nodemailer');
const transporter = require('../Controllers/Transporter');




// Send email
async function varified(useremail,otp){
//  const result = await otpModel.create({email:useremail,otp:otp,otpExpires:Date.now()+600000,verified:false});
// const otp = generateOtp();
    const mailOptions = {
        from: 'm61331916@gmail.com',
        to: useremail,
        subject: 'Varification Code',
        text: `Your varification code is ${otp}. This code will expire in 10 minutes.`,
      };
    await transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent: " + info.response);
  }
})

}


module.exports = {varified};

