import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants/assets';
import '../styles/Sell.css';
import { useAuth } from '../context/AuthContext';

const Sell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
        },
        type: '',
        status: 'for-sale',
        bedrooms: '',
        bathrooms: '',
        area: '',
        yearBuilt: '',
        features: [],
        amenities: [],
        images: [],
        name: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            // Handle nested address fields
            const [parent, child] = name.split('.');
            setFormData(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleFeaturesChange = (e) => {
        const features = e.target.value.split(',').map(feature => feature.trim());
        setFormData(prevState => ({
            ...prevState,
            features
        }));
    };

    const handleAmenitiesChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => {
            if (checked) {
                // Add the amenity if checked
                return {
                    ...prevState,
                    amenities: [...prevState.amenities, value]
                };
            } else {
                // Remove the amenity if unchecked
                return {
                    ...prevState,
                    amenities: prevState.amenities.filter(amenity => amenity !== value)
                };
            }
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        
        files.forEach((file, index) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload images');
            }

            const data = await response.json();
            setFormData(prevState => ({
                ...prevState,
                images: data.imageUrls 
            }));
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Check if user is logged in
        if (!user) {
            setError('You must be logged in to list a property.');
            setLoading(false);
            return;
        }

        try {
            // Validate required fields
            if (!formData.title || !formData.price || !formData.type || !formData.status || !formData.bedrooms || !formData.bathrooms || !formData.area || !formData.description || !formData.location) {
                throw new Error('Please fill in all required fields');
            }

            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                setError('Authentication token missing. Please log in again.');
                setLoading(false);
                return;
            }

            // Normalize and prepare data
            const propertyData = {
                ...formData,
                type: formData.type.toLowerCase(),
                status: formData.status.toLowerCase(),
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area: Number(formData.area),
                yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
                agent: user.id || user._id,
                owner: user.id || user._id
            };

            const response = await fetch('http://localhost:5001/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(propertyData)
            });

            const responseData = await response.json();
            if (!response.ok) {
                // Show backend error details if available
                throw new Error(responseData.message || responseData.error || 'Failed to create property listing');
            }

            alert('Property listing created successfully!');
            navigate('/properties');
        } catch (err) {
            setError(err.message || 'Failed to submit property listing');
            alert(err.message || 'Failed to submit property listing');
        } finally {
            setLoading(false);
        }
    };

    const sellerBenefits = [
        {
            icon: "fa-chart-line",
            title: "Maximum Exposure",
            description: "Get your property in front of thousands of qualified buyers through our extensive network and marketing channels."
        },
        {
            icon: "fa-dollar-sign",
            title: "Best Price",
            description: "Our expert agents use market analysis and negotiation skills to ensure you get the best possible price for your property."
        },
        {
            icon: "fa-file-contract",
            title: "Easy Process",
            description: "Experience a streamlined selling process with dedicated support and clear communication at every step."
        }
    ];

    const sellingGuides = [
        {
            id: 1,
            title: "Home Staging Guide",
            description: "Professional tips to make your home more attractive to potential buyers and increase its market value.",
            icon: "fa-paint-brush"
        },
        {
            id: 2,
            title: "Pricing Strategy",
            description: "Learn how to price your home competitively based on market trends and property features.",
            icon: "fa-chart-line"
        },
        {
            id: 3,
            title: "Marketing Tips",
            description: "Discover effective ways to market your property and reach the right audience.",
            icon: "fa-bullhorn"
        }
    ];

    const featuredListings = [
        {
            id: 1,
            title: "Spacious Family Home",
            price: 750000,
            location: "Suburban Area",
            image: IMAGES.FAMILY_HOME,
            features: ["4 Beds", "3 Baths", "3,200 sqft"]
        },
        {
            id: 2,
            title: "Cozy Downtown Condo",
            price: 450000,
            location: "City Center",
            image: IMAGES.CONDO,
            features: ["2 Beds", "2 Baths", "1,500 sqft"]
        }
    ];

    return (
        <div className="sell-page">
            <section className="sell-hero">
                <div className="hero-content">
                    <h1>Sell Your Property</h1>
                    <p>List your property with us and get the best value for your home</p>
                </div>
            </section>

            <section className="benefits-section">
                <div className="container">
                    <h2>Why Sell With Us?</h2>
                    <div className="benefits-grid">
                        {sellerBenefits.map((benefit, index) => (
                            <div key={index} className="benefit-card">
                                <i className={`fas ${benefit.icon}`}></i>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="listing-form" id="listing-form">
                <div className="container">
                    <h2>List Your Property</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-group">
                            <label htmlFor="title">Property Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter property title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Property Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Property Type</option>
                                <option value="House">House</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Penthouse">Penthouse</option>
                                <option value="Land">Land</option>
                                <option value="Cabin">Cabin</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Property Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Property Status</option>
                                <option value="for-sale">For Sale</option>
                                <option value="for-rent">For Rent</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter location"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.street">Street Address</label>
                            <input
                                type="text"
                                id="address.street"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                placeholder="Enter street address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.city">City</label>
                            <input
                                type="text"
                                id="address.city"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.state">State</label>
                            <input
                                type="text"
                                id="address.state"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                placeholder="Enter state"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address.zipCode">ZIP Code</label>
                            <input
                                type="text"
                                id="address.zipCode"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                placeholder="Enter ZIP code"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bedrooms">Bedrooms</label>
                            <input
                                type="number"
                                id="bedrooms"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                placeholder="Number of bedrooms"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <input
                                type="number"
                                id="bathrooms"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                placeholder="Number of bathrooms"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="area">Area (sq ft)</label>
                            <input
                                type="number"
                                id="area"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder="Property area"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="yearBuilt">Year Built</label>
                            <input
                                type="number"
                                id="yearBuilt"
                                name="yearBuilt"
                                value={formData.yearBuilt}
                                onChange={handleChange}
                                placeholder="Year built"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="features">Features</label>
                            <input
                                type="text"
                                id="features"
                                name="features"
                                value={formData.features.join(', ')}
                                onChange={handleFeaturesChange}
                                placeholder="Enter features (comma-separated)"
                            />
                        </div>

                        <div className="form-group">
                            <label>Amenities</label>
                            <div className="amenities-grid">
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="gym"
                                        name="amenities"
                                        value="Gym"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="gym">Gym</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="playground"
                                        name="amenities"
                                        value="Playground"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="playground">Playground</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="swimmingPool"
                                        name="amenities"
                                        value="Swimming Pool"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="swimmingPool">Swimming Pool</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="parking"
                                        name="amenities"
                                        value="Parking"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="parking">Parking</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="security"
                                        name="amenities"
                                        value="24/7 Security"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="security">24/7 Security</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="garden"
                                        name="amenities"
                                        value="Garden"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="garden">Garden</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="powerBackup"
                                        name="amenities"
                                        value="Power Backup"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="powerBackup">Power Backup</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="lift"
                                        name="amenities"
                                        value="Lift"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="lift">Lift</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="clubhouse"
                                        name="amenities"
                                        value="Clubhouse"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="clubhouse">Clubhouse</label>
                                </div>
                                <div className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        id="waterSupply"
                                        name="amenities"
                                        value="24/7 Water Supply"
                                        onChange={handleAmenitiesChange}
                                    />
                                    <label htmlFor="waterSupply">24/7 Water Supply</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your property..."
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="images">Property Images</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                onChange={handleImageChange}
                                multiple
                                accept="image/*"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Listing'}
                        </button>
                    </form>
                </div>
            </section>

            <section className="selling-guides">
                <div className="container">
                    <h2>Selling Guides</h2>
                    <div className="guides-grid">
                        {sellingGuides.map((guide) => (
                            <div key={guide.id} className="guide-card">
                                <i className={`fas ${guide.icon}`}></i>
                                <h3>{guide.title}</h3>
                                <p>{guide.description}</p>
                                <Link to="#" className="guide-link">Learn More →</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Sell;