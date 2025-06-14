import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Properties.css';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        priceRange: '',
        propertyType: '',
        bedrooms: '',
        location: '',
        status: ''
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        console.log('Fetching properties...');
        try {
            const response = await fetch('http://localhost:5001/api/properties');
            console.log('API Response:', response);
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            console.log('Fetched properties:', data);
            setProperties(data.properties || []);
            setError(null);
        } catch (err) {
            console.error('Detailed error:', err);
            setError('Error fetching properties: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (propertyId) => {
        if (!window.confirm('Are you sure you want to delete this property?')) {
            return;
        }

        try {
            // First, login as admin to get the token
            console.log('Attempting to authenticate...');
            const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'admin@example.com',
                    password: 'admin123'
                })
            });

            if (!loginResponse.ok) {
                const loginError = await loginResponse.text();
                console.error('Authentication failed:', loginError);
                throw new Error(`Authentication failed: ${loginError}`);
            }

            const loginData = await loginResponse.json();
            const token = loginData.token;
            console.log('Authentication successful, proceeding with deletion...');

            // Delete the property
            console.log(`Attempting to delete property ${propertyId}...`);
            const deleteResponse = await fetch(`http://localhost:5001/api/properties/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!deleteResponse.ok) {
                const deleteError = await deleteResponse.text();
                console.error('Delete failed:', deleteError);
                throw new Error(`Failed to delete property: ${deleteError}`);
            }

            // Remove the property from the state
            setProperties(prevProperties => 
                prevProperties.filter(property => property._id !== propertyId)
            );

            alert('Property deleted successfully!');
        } catch (err) {
            console.error('Detailed error:', err);
            alert(err.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log('Filter changed:', name, value);
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredProperties = properties.filter(property => {
        console.log('Filtering property:', property);
        return (
            (!filters.priceRange || property.price <= parseInt(filters.priceRange)) &&
            (!filters.propertyType || property.type.toLowerCase() === filters.propertyType.toLowerCase()) &&
            (!filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms)) &&
            (!filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
            (!filters.status || property.status === filters.status)
        );
    });

    return (
        <div className="properties-page">
            <section className="search-section">
                <div className="search-container">
                    <h1><center>Find Your Perfect Property</center></h1>
                    <div className="filters">
                        <select
                            name="priceRange"
                            value={filters.priceRange}
                            onChange={handleFilterChange}
                        >
                            <option value="">Price Range</option>
                            <option value="500000">Under ₹5,00,000</option>
                            <option value="750000">Under ₹7,50,000</option>
                            <option value="1000000">Under ₹10,00,000</option>
                            <option value="1500000">Under ₹15,00,000</option>
                        </select>
                        <select
                            name="propertyType"
                            value={filters.propertyType}
                            onChange={handleFilterChange}
                        >
                            <option value="">Property Type</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Penthouse">Penthouse</option>
                            <option value="Land">Land</option>
                            <option value="Cabin">Cabin</option>
                        </select>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Properties</option>
                            <option value="for-sale">For Sale</option>
                            <option value="for-rent">For Rent</option>
                        </select>
                        <select
                            name="bedrooms"
                            value={filters.bedrooms}
                            onChange={handleFilterChange}
                        >
                            <option value="">Bedrooms</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                        </select>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={filters.location}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </section>
            
            <section className="properties-section">
                <div className="properties-grid">
                    {loading ? (
                        <div className="loading-message">Loading properties...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="no-properties">No properties found matching your criteria.</div>
                    ) : (
                        filteredProperties.map(property => (
                            <div key={property._id} className="property-card">
                                <Link to={`/property/${property._id}`} className="property-link">
                                    <div className="property-image">
                                        <img 
                                            src={property.images?.[0] ? `http://localhost:5001${property.images[0]}` : '/images/property1.jpg'} 
                                            alt={property.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/property1.jpg';
                                            }}
                                        />
                                        <div className="property-price">
                                            ₹{property.price.toLocaleString('en-IN')}
                                        </div>
                                        <div className="property-type">
                                            {property.type}
                                        </div>
                                    </div>
                                    <div className="property-details">
                                        <h3>{property.title}</h3>
                                        <p className="location">{property.location}</p>
                                        <p className="description">{property.description}</p>
                                        <div className="property-specs">
                                            <span>{property.bedrooms} Beds</span>
                                            <span>{property.bathrooms} Baths</span>
                                            <span>{property.area} sqft</span>
                                        </div>
                                        <div className="property-features">
                                            {property.features?.slice(0, 4).map((feature, index) => (
                                                <span key={index}>{feature}</span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                                <div className="property-actions">
                                    <Link to={`/property/${property._id}`} className="view-details">
                                        View Details
                                    </Link>
                                    <button 
                                        className="delete-property"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(property._id);
                                        }}
                                    >
                                        Delete Property
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Properties; 