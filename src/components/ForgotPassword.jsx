import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset password for:', email);
    };

    return (
        <div className="login-container">
            <div className="left-section">
                <h1>No Worries.!!</h1>
                <p className="subtitle">We'll take you back...</p>
            </div>
            <div className="right-section">
                <div className="form-container">
                    <h2>REALTOR</h2>
                    <h3>Forgot Password ?</h3>
                    <p className="welcome-text">Please enter you're email</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@mail.com"
                                required
                            />
                        </div>
                        <button type="submit" className="reset-password-btn">Reset Password</button>
                    </form>

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

export default ForgotPassword; 