import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Rent.css';

const Rent = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tempFilters, setTempFilters] = useState({
        priceRange: [0, 1000000000],
        propertyType: 'all',
        bedrooms: 'all',
        location: ''
    });
    const [filters, setFilters] = useState(tempFilters);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/properties');
                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }
                const data = await response.json();
                console.log('All properties fetched:', data.properties);
                
                // Filter for properties that are for rent
                const forRentProperties = data.properties.filter(property => {
                    console.log('Checking property:', {
                        id: property._id,
                        title: property.title,
                        status: property.status,
                        type: property.type
                    });
                    return property.status === 'for-rent';
                });
                
                console.log('Rental properties found:', forRentProperties);
                setProperties(forRentProperties);
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleFilterChange = (field, value) => {
        setTempFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyFilters = () => {
        setFilters(tempFilters);
    };

    const filteredProperties = properties.filter(property => {
        const matchesPrice = property.price >= tempFilters.priceRange[0] && 
                           property.price <= tempFilters.priceRange[1];
        const matchesType = tempFilters.propertyType === 'all' || 
                          property.type.toLowerCase() === tempFilters.propertyType;
        const matchesBedrooms = tempFilters.bedrooms === 'all' || 
                              (tempFilters.bedrooms === '4+' ? 
                                property.bedrooms >= 4 : 
                                property.bedrooms === parseInt(tempFilters.bedrooms));
        return matchesPrice && matchesType && matchesBedrooms;
    });

    return (
        <div className="rent-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Perfect Rental</h1>
                    <p>Browse through our selection of properties for rent</p>
                </div>
            </section>

            <section className="filters-section">
                <div className="container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Price Range</label>
                            <div className="price-inputs">
                                <input 
                                    type="number"
                                    value={tempFilters.priceRange[0]}
                                    onChange={(e) => handleFilterChange('priceRange', [
                                        parseInt(e.target.value) || 0,
                                        tempFilters.priceRange[1]
                                    ])}
                                    placeholder="Min"
                                />
                                <span>to</span>
                                <input 
                                    type="number"
                                    value={tempFilters.priceRange[1]}
                                    onChange={(e) => handleFilterChange('priceRange', [
                                        tempFilters.priceRange[0],
                                        parseInt(e.target.value) || 5000
                                    ])}
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Property Type</label>
                            <select 
                                value={tempFilters.propertyType}
                                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="penthouse">Penthouse</option>
                                <option value="land">Land</option>
                                <option value="cabin">Cabin</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Bedrooms</label>
                            <select 
                                value={tempFilters.bedrooms}
                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                            >
                                <option value="all">Any</option>
                                <option value="0">Studio</option>
                                <option value="1">1 Bed</option>
                                <option value="2">2 Beds</option>
                                <option value="3">3 Beds</option>
                                <option value="4+">4+ Beds</option>
                            </select>
                        </div>

                        <button className="apply-filters" onClick={applyFilters}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            </section>

            <section className="properties-section">
                <div className="container">
                    {loading && <div className="loading">Loading properties...</div>}
                    {error && <div className="error">Error: {error}</div>}
                    <div className="properties-grid">
                        {filteredProperties.map(property => (
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
                                    ₹{property.price.toLocaleString('en-IN')}/month
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
        </div>
    );
};

export default Rent; 