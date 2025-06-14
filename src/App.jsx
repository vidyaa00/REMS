import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Rent from './pages/Rent';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import './styles.css';
import MortgageCalculator from './pages/MortgageCalculator';
import ForgotPassword from './pages/ForgotPassword';

const AppRoutes = () => {
    const location = useLocation();
    const hideNavbarRoutes = ['/login', '/signup', '/forgot'];
    const hideFooterRoutes = ['/login', '/signup', '/forgot'];
    const hideNavbar = hideNavbarRoutes.includes(location.pathname);
    const hideFooter = hideFooterRoutes.includes(location.pathname);
    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/mortgage" element={<MortgageCalculator />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {!hideFooter && <Footer />}
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;