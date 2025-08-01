import React, { useState } from "react";
import { Link } from "react-router-dom";

// ✅ 1. Import DatePicker and its CSS
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../assets/registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    // ✅ 2. Initialize dob as null for the date picker
    dob: null,
    email: "",
    phone: "",
    password: "",
    address: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  // ✅ 3. Create a new handler specifically for the DatePicker
  const handleDobChange = (date) => {
    setFormData((prev) => ({ ...prev, dob: date }));
  };

  const handleGender = (e) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullname, dob, email, phone, password, address, gender } = formData;

    if (!fullname || !dob || !email || !phone || !password || !address || !gender) {
      alert("❌ Please fill out all fields.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    alert(`✅ Registration Successful!\nWelcome, ${fullname}!`);
    setFormData({
      fullname: "",
      dob: null,
      email: "",
      phone: "",
      password: "",
      address: "",
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
              <label htmlFor="dob">Date of Birth</label>
              {/* ✅ 4. Replace the old input with the DatePicker component */}
              <DatePicker
                id="dob"
                selected={formData.dob}
                onChange={handleDobChange}
                dateFormat="MM/dd/yyyy"
                // placeholderText="Select a date"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={80}
                maxDate={new Date()} // Users cannot select a future date
                className="custom-datepicker-input" // Optional: for custom styling
              />
            </div>
          </div>
          {/* ... all other form rows remain the same ... */}
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
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={formData.address}
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
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;