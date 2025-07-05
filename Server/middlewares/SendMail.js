const transporter = require('../Controllers/Transporter');
const dotenv = require("dotenv");
dotenv.config();

async function varified(useremail, otp) {
  try {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: useremail,
      subject: 'Account Verification Code',
      text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Account Verification</h2>
          <p>Hello,</p>
          <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your account:</p>
          <h1 style="color: #007bff; font-size: 28px; text-align: center; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Regards,<br>Your App Team</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending verification email:", error);
      } else {
        console.log("Verification email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error in varified function (email send):", error);
  }
}

async function sendOtpForPasswordReset(useremail, otp) {
  try {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: useremail,
      subject: 'Password Reset OTP',
      text: `Your One-Time Password for password reset is ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Password Reset OTP</h2>
          <p>Hello,</p>
          <p>You have requested a password reset. Please use the following One-Time Password (OTP) to proceed:</p>
          <h1 style="color: #d9534f; font-size: 28px; text-align: center; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Regards,<br>Your App Team</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending password reset OTP email:", error);
      } else {
        console.log("Password reset OTP email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error in sendOtpForPasswordReset function:", error);
  }
}

module.exports = { varified, sendOtpForPasswordReset };

