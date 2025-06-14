import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
    };

    return (
        <div className="login-container">
            <div className="left-section">
                <h1>Welcome Back .!</h1>
                <p className="subtitle">Login to start...</p>
            </div>
            <div className="right-section">
                <div className="form-container">
                    <h2>REALTOR</h2>
                    <h3>Login</h3>
                    <p className="welcome-text">Glad you're back!</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                    </form>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="social-login">
                        <button className="social-btn google">
                            <img src={IMAGES.GOOGLE} alt="Google" />
                        </button>
                        <button className="social-btn facebook">
                            <img src={IMAGES.FACEBOOK} alt="Facebook" />
                        </button>
                        <button className="social-btn instagram">
                            <img src={IMAGES.INSTAGRAM} alt="Instagram" />
                        </button>
                    </div>

                    <p className="signup-text">
                        Don't have an account? <Link to="/signup">Signup</Link>
                    </p>

                    <div className="footer-links">
                        <Link to="/terms">Terms & Conditions</Link>
                        <Link to="/support">Support</Link>
                        <Link to="/customer-care">Customer Care</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 