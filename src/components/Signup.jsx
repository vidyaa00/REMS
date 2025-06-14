import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import '../styles/Login.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        emailPhone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup attempt:', formData);
    };

    return (
        <div className="login-container">
            <div className="left-section">
                <h1>Roll the Carpet.!</h1>
                <p className="subtitle">Signup fast to start...</p>
            </div>
            <div className="right-section">
                <div className="form-container">
                    <h2>REALTOR</h2>
                    <h3>Signup</h3>
                    <p className="welcome-text">Just some details to get you in.!</p>
                    
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
                                type="text"
                                name="emailPhone"
                                value={formData.emailPhone}
                                onChange={handleChange}
                                placeholder="Email / Phone"
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
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                            />
                        </div>
                        <button type="submit" className="signup-btn">Signup</button>
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

                    <p className="login-text">
                        Already Registered? <Link to="/">Login</Link>
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

export default Signup; 