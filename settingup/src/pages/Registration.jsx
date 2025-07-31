import React, { useState } from "react";
import "../assets/registration.css";
import { Link } from "react-router-dom"; // ✅

const Registration = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGender = (e) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      fullname,
      username,
      email,
      phone,
      password,
      confirmPassword,
      gender,
    } = formData;

    if (
      !fullname ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      alert("❌ Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert(`✅ Registration Successful!\nWelcome, ${fullname}!`);
    setFormData({
      fullname: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <form onSubmit={handleSubmit}>
          <h2>Registration</h2>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="gender-group">
            <label>Gender</label>
            <div className="radio-row">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleGender}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className="radio-row">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleGender}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className="radio-row">
              <input
                type="radio"
                id="other"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleGender}
              />
              <label htmlFor="other">Prefer not to say</label>
            </div>
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
            <p className="text-center mt-4">
          Already registered? <Link to="/login">Login</Link> {/* ✅ Link added */}
        </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
