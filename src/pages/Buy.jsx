import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import '../styles/Buy.css';

const Buy = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const buyingGuides = [
        {
            id: 1,
            title: "First-Time Home Buyer's Guide",
            description: "Everything you need to know about buying your first home",
            icon: "fa-home",
            link: "/buying-guide"
        },
        {
            id: 2,
            title: "Mortgage Calculator",
            description: "Calculate your monthly payments and interest rates",
            icon: "fa-calculator",
            link: "/mortgage-calculator"
        },
        {
            id: 3,
            title: "Property Inspection Tips",
            description: "What to look for when inspecting a property",
            icon: "fa-search",
            link: "/inspection-guide"
        }
    ];

    const featuredProperties = [
        {
            id: 1,
            title: "Luxury Beachfront Villa",
            price: 1200000,
            location: "Miami Beach, FL",
            image: IMAGES.LUXURY_VILLA,
            features: ["5 Beds", "4 Baths", "4,500 sqft"]
        },
        {
            id: 2,
            title: "Modern City Penthouse",
            price: 850000,
            location: "Downtown LA",
            image: IMAGES.PENTHOUSE,
            features: ["3 Beds", "3 Baths", "2,800 sqft"]
        }
    ];

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/properties');
                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }
                const data = await response.json();
                const forSaleProperties = data.properties.filter(
                    property => property.status === 'for-sale'
                );
                setProperties(forSaleProperties);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return (
        <div className="buy-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Dream Home</h1>
                    <p>Discover amazing properties in prime locations across the country</p>
                    <div className="hero-buttons">
                        <Link to="/properties" className="primary-btn">
                            Browse Properties
                        </Link>
                        <Link to="/mortgage" className="secondary-btn">
                            Calculate Mortgage
                        </Link>
                    </div>
                </div>
            </section>

            <section className="guides-section">
                <div className="container">
                    <h2>Buying Resources</h2>
                    <div className="guides-grid">
                        {buyingGuides.map(guide => (
                            <Link to={guide.link} key={guide.id} className="guide-card">
                                <i className={`fas ${guide.icon}`}></i>
                                <h3>{guide.title}</h3>
                                <p>{guide.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="featured-properties">
                <div className="container">
                    <h2>Properties for Sale</h2>
                    {loading && <div className="loading">Loading properties...</div>}
                    {error && <div className="error">Error: {error}</div>}
                    <div className="properties-grid">
                        {properties.map(property => (
                            <div key={property._id} className="property-card">
                                <div className="property-image">
                                    <img 
                                        src={property.images?.[0] ? `http://localhost:5001${property.images[0]}` : '/images/property1.jpg'} 
                                        alt={property.title} 
                                        onError={(e) => {
                                            e.target.src = '/images/property1.jpg';
                                        }}
                                    />
                                    <div className="property-price">
                                        ₹{property.price.toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="property-details">
                                    <h3>{property.title}</h3>
                                    <p className="location">
                                        <i className="fas fa-map-marker-alt"></i> {property.location}
                                    </p>
                                    <div className="features">
                                        <span>{property.bedrooms} Beds</span>
                                        <span>{property.bathrooms} Baths</span>
                                        <span>{property.area} sqft</span>
                                    </div>
                                    <Link to={`/property/${property._id}`} className="view-property">
                                        View Property
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="why-buy">
                <div className="container">
                    <h2>Why Buy With Us?</h2>
                    <div className="benefits-grid">
                        <div className="benefit">
                            <i className="fas fa-shield-alt"></i>
                            <h3>Trusted Agents</h3>
                            <p>Work with experienced professionals who put your interests first</p>
                        </div>
                        <div className="benefit">
                            <i className="fas fa-hand-holding-usd"></i>
                            <h3>Best Deals</h3>
                            <p>Access to exclusive properties and competitive prices</p>
                        </div>
                        <div className="benefit">
                            <i className="fas fa-clock"></i>
                            <h3>24/7 Support</h3>
                            <p>Round-the-clock assistance for all your queries</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Buy; 