import React, { useState } from "react";
import "../assets/sigin.css";
import { Link } from "react-router-dom"; // ✅


const Signin = () => {
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", form);
    alert("Account creation successful! (Check console)");
  };

  return (
    <div>
      <h1 className="page-title">Sign Up Page</h1>
      <div className="signup-container">
        <div className="left-panel">
          <div className="logo">
            <i className="fa-solid fa-hospital-user"></i>
          </div>
          <h1>We at MediCare are fully focused on helping you.</h1>
          <p>Join our community to manage your health with ease.</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTyTFNVSig8IEBctgJ9GLB1TIjX3k4pnv7Nw&s"
            alt="Stethoscope"
            className="stethoscope-img"
          />
        </div>
        <div className="right-panel">
          <div className="form-content">
            <h2>Create Account</h2>
            <div className="social-login">
              <a href="#" className="social-btn google">
                <i className="fa-brands fa-google"></i> Google
              </a>
              <a href="#" className="social-btn facebook">
                <i className="fa-brands fa-facebook-f"></i> Facebook
              </a>
            </div>
            <div className="divider">
              <span>- OR -</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  required
                  value={form.fullname}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fullname: e.target.value }))
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <i
                  className={`fa-regular ${
                    showPass ? "fa-eye" : "fa-eye-slash"
                  } eye-icon`}
                  onClick={() => setShowPass((prev) => !prev)}
                ></i>
              </div>
              <button type="submit" className="create-account-btn">
                Create Account
              </button>
            </form>
            <div className="login-link">
             <p>
  Already have an account? <Link to="/login">Login</Link> {/* ✅ Link */}
</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
