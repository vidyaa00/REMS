import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const { confirmPassword, ...userData } = formData;
            await register(userData);
            navigate('/');
        } catch (error) {
            setErrorMsg(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <h1>Roll the Carpet.!</h1>
                <div className="auth-subtitle">Signup fast to start...</div>
            </div>
            <div className="auth-right">
                <div className="auth-container">
                    <div className="auth-header">
                        <h2>REALTOR</h2>
                        <div className="auth-title">Signup</div>
                        <p>Just some details to get you in.!</p>
                    </div>

                    {errorMsg && <div className="error-message">{errorMsg}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Signup'}
                        </button>
                    </form>

                    <div className="divider">
                        <span></span>
                    </div>

                    <div className="auth-footer">
                        <p>Already Registered? <Link to="/">Login</Link></p>
                        <div className="footer-links">
                            <Link to="/terms">Terms & Conditions</Link>
                            <Link to="/support">Support</Link>
                            <Link to="/customer-care">Customer Care</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;