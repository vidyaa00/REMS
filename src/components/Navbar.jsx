import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-left">
                <Link to="/" className="logo">
                    <img src={IMAGES.LOGO} alt="REALTOR" />
                    <span>REALTOR</span>
                </Link>
            </div>
            <div className="nav-center">
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                    Home
                </Link>
                <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>
                    Properties
                </Link>
                <Link to="/buy" className={`nav-link ${isActive('/buy') ? 'active' : ''}`}>
                    Buy
                </Link>
                <Link to="/sell" className={`nav-link ${isActive('/sell') ? 'active' : ''}`}>
                    Sell
                </Link>
                <Link to="/rent" className={`nav-link ${isActive('/rent') ? 'active' : ''}`}>
                    Rent
                </Link>
            </div>
            <div className="nav-right">
                {user ? (
                    <div className="user-menu" ref={menuRef}>
                        <div 
                            className="user-menu-toggle" 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <span className="user-name">{user.name}</span>
                            <span className="user-icon">👤</span>
                        </div>
                        {showUserMenu && (
                            <div className="user-menu-dropdown">
                                <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>Profile</Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="logout-button">Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">
                            Login  
                        </Link>
                        <Link to="/signup" className="get-started-btn">
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;