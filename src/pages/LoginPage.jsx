import React, { useState, useEffect, useRef } from 'react';
import '../assets/LoginPage.css';
import { Link } from "react-router-dom";
// import './LoginPage.css'; // Make sure the CSS file is in the same folder

function LoginPage() {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    
    // State for UI logic
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Ref for the illustration element to animate
    const illustrationRef = useRef(null);

    // This useEffect handles the floating animation
    useEffect(() => {
        const illustration = illustrationRef.current;
        if (!illustration) return;

        let floatDirection = 1;
        const intervalId = setInterval(() => {
            const currentTransform = illustration.style.transform || 'translateY(0px)';
            const currentY = parseInt(currentTransform.match(/-?\d+/)?.[0] || 0);

            if (currentY >= 10) floatDirection = -1;
            if (currentY <= -10) floatDirection = 1;

            illustration.style.transform = `translateY(${currentY + floatDirection * 0.5}px)`;
        }, 50); // Adjusted interval for smoother animation

        // Cleanup function to stop the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this runs only once on mount

    // Toggles password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    // Handles the form submission
    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password && !isLoading) {
            setIsLoading(true);
            setTimeout(() => {
                alert('Login successful! (This is a demo)');
                setIsLoading(false);
            }, 1500);
        }
    };

    return (
        <div className="login-container">
            <div className="left-panel">
                <div className="doctor-illustration" ref={illustrationRef}>
                    <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTyTFNVSig8IEBctgJ9GLB1TIjX3k4pnv7Nw&s"
            alt="Stethoscope"
            className="stethoscope-img"
          />
                </div>
                <div className="tagline">
                    <h2>Empowering Healthcare</h2>
                    <p>One Click at a Time. Your Health, Your Records, Your Control</p>
                </div>
            </div>

            <div className="right-panel">
                <div className="login-header">
                    <h1 className="login-title">Login</h1>
                    <p className="login-subtitle">Welcome back! Please enter your details</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="password-container">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>

                    
                </form>
            </div>
        </div>
    );
}

export default LoginPage;