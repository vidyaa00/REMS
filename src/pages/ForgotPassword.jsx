import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: reset form
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (step === 1) {
            // Request reset token
            try {
                const res = await fetch('http://localhost:5001/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to send reset link');
                setResetToken(data.resetToken); // For demo, backend returns token
                setStep(2);
                setMessage('A reset link has been sent to your email (mock).');
            } catch (err) {
                setError(err.message);
            }
        } else if (step === 2) {
            // Reset password
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            try {
                const res = await fetch('http://localhost:5001/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: resetToken, newPassword })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to reset password');
                setMessage('Password reset successful! You can now log in.');
                setStep(3);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <h1>No Worries.!!</h1>
                <div className="auth-subtitle">We'll take you back...</div>
            </div>
            <div className="auth-right">
                <div className="auth-container">
                    <div className="auth-header">
                        <h2>REALTOR</h2>
                        <div className="auth-title">Forgot Password ?</div>
                        <p>Please enter your email</p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}
                    {step === 1 && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-button reset-password">
                                Send Reset Link
                            </button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-button reset-password">
                                Reset Password
                            </button>
                        </form>
                    )}
                    {step === 3 && (
                        <div className="success-message">Password reset successful! <Link to="/login">Login</Link></div>
                    )}
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

export default ForgotPassword;