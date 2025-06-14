import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);
        
        try {
            await login(formData.email, formData.password);
            navigate('/'); 
        } catch (error) {
            setErrorMsg(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <h1>Welcome Back .!</h1>
                <div className="auth-subtitle">Login to start...</div>
            </div>
            <div className="auth-right">
                <div className="auth-container">
                    <div className="auth-header">
                        <h2>REALTOR</h2>
                        <div className="auth-title">Login</div>
                        <p>Glad you're back!</p>
                    </div>

                    {errorMsg && <div className="error-message">{errorMsg}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
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
                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                Remember me
                            </label>
                            <Link to="/forgot" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>
                        <button 
                            type="submit" 
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="divider">
                        <span></span>
                    </div>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
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

export default Login;