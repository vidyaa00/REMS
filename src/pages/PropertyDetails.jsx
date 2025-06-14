import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/PropertyDetails.css';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) {
                setError('Invalid property ID');
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // If not logged in, redirect to login
                    navigate('/login', { state: { from: `/property/${id}` } });
                    return;
                }

                const response = await fetch(`http://localhost:5001/api/properties/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // If unauthorized, redirect to login
                        navigate('/login', { state: { from: `/property/${id}` } });
                        return;
                    }
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data) {
                    throw new Error('No property data received');
                }

                setProperty(data);
            } catch (err) {
                setError(`Failed to load property details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="loading">
                <h2>Loading Property Details...</h2>
                <p>Please wait while we fetch the property information.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>Error Loading Property</h2>
                <p>{error}</p>
                <Link to="/properties" className="back-button">
                    Back to Properties
                </Link>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="not-found">
                <h2>Property Not Found</h2>
                <p>The property you're looking for doesn't exist or has been removed.</p>
                <Link to="/properties" className="back-button">
                    Back to Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="property-details-page">
            <div className="property-header">
                <div className="container">
                    <h1>{property.title}</h1>
                    <div className="property-meta">
                        <span className="location">
                            <i className="fas fa-map-marker-alt"></i> {property.location}
                        </span>
                        <span className="price">₹{property.price.toLocaleString('en-IN')}</span>
                        <span className="type">{property.type}</span>
                    </div>
                </div>
            </div>

            <div className="property-content">
                <div className="container">
                    <div className="property-gallery">
                        <div className="main-image">
                            <img 
                                src={property.images?.[activeImage] ? `http://localhost:5001${property.images[activeImage]}` : '/images/property1.jpg'} 
                                alt={property.title}
                            />
                        </div>
                        <div className="thumbnail-gallery">
                            {property.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5001${image}`}
                                    alt={`${property.title} - Image ${index + 1}`}
                                    className={index === activeImage ? 'active' : ''}
                                    onClick={() => setActiveImage(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="property-info">
                        <div className="overview">
                            <h2>Overview</h2>
                            <p>{property.description}</p>
                        </div>

                        <div className="property-features">
                            <h2>Features</h2>
                            <div className="features-grid">
                                <div className="feature-item">
                                    <i className="fas fa-bed"></i>
                                    <span>{property.bedrooms} Bedrooms</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-bath"></i>
                                    <span>{property.bathrooms} Bathrooms</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-ruler-combined"></i>
                                    <span>{property.area} sqft</span>
                                </div>
                                <div className="feature-item">
                                    <i className="fas fa-building"></i>
                                    <span>{property.type}</span>
                                </div>
                                {property.yearBuilt && (
                                    <div className="feature-item">
                                        <i className="fas fa-calendar-alt"></i>
                                        <span>Built in {property.yearBuilt}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="amenities">
                            <h2>Amenities</h2>
                            <div className="amenities-grid">
                                {property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 ? (
                                    property.amenities.map((amenity, index) => (
                                        <div key={index} className="amenity-item">
                                            <i className="fas fa-check"></i>
                                            <span>{amenity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No amenities listed</p>
                                )}
                            </div>
                        </div>

                        <div className="property-location">
                            <h2>Location</h2>
                            <div className="location-details">
                                <p><strong>Address:</strong> {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}</p>
                            </div>
                        </div>

                        <div className="contact-section">
                            <h2>Contact Agent</h2>
                            <div className="agent-info">
                                <div className="agent-details">
                                    <h3>{property.agent?.name}</h3>
                                    <p><i className="fas fa-envelope"></i> {property.agent?.email}</p>
                                    <p><i className="fas fa-phone"></i> {property.agent?.phone}</p>
                                </div>
                                <button className="contact-button">
                                    <i className="fas fa-envelope"></i> Contact Agent
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails; 