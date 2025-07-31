import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import "../assets/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    alert(`Login Successful!\nWelcome, ${username}!`);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
            </label>
            <input
              type="text"
              id="username"
              placeholder="Type your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Type your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="forgot-password">
            <Link to="/signin">Forgot password?</Link> {/* Or wherever reset goes */}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="or-signup">
          <hr />
          <span>Or sign up using</span>
          <div className="social-icons">
            <a href="#" className="social-icon facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon google">
              <i className="fab fa-google"></i>
            </a>
          </div>
        </div>

        <div className="signup-link">
          Or sign up using <Link to="/signin">SIGN UP</Link> {/* ✅ Link added */}
        </div>
      </div>
    </div>
  );
};

export default Login;
