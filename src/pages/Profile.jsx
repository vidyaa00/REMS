import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(user);
    const [listedProperties, setListedProperties] = useState([]);
    const [visitedProperties, setVisitedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhoto, setEditPhoto] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                let data = user;
                let shouldFetch = false;
                if (!user) {
                    shouldFetch = true;
                }
                if (shouldFetch) {
                    const token = localStorage.getItem('token');
                    const res = await fetch('http://localhost:5001/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Failed to fetch profile');
                    data = await res.json();
                }
                // Always use the latest profilePicture from localStorage if available
                const localProfilePic = localStorage.getItem('profilePicture');
                if (localProfilePic) {
                    data = { ...data, profilePicture: localProfilePic };
                }
                if (data && data.profilePicture) {
                    localStorage.setItem('profilePicture', data.profilePicture);
                }
                setProfile(data);
                const ownerId = (data && (data.id || data._id)) || (user && (user.id || user._id));
                if (ownerId) {
                    const token = localStorage.getItem('token');
                    const listedRes = await fetch(`http://localhost:5001/api/properties/owner/${ownerId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (listedRes.ok) {
                        const listed = await listedRes.json();
                        setListedProperties(listed);
                    } else {
                        const errData = await listedRes.json();
                        setError(errData.message || 'Failed to fetch listed properties');
                    }
                }
                if (data && data.visitedProperties && Array.isArray(data.visitedProperties) && data.visitedProperties.length > 0) {
                    const token = localStorage.getItem('token');
                    const visitedRes = await fetch(`http://localhost:5001/api/properties/visited`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ ids: data.visitedProperties })
                    });
                    if (visitedRes.ok) {
                        const visited = await visitedRes.json();
                        setVisitedProperties(visited);
                    } else {
                        const errData = await visitedRes.json();
                        setError(errData.message || 'Failed to fetch visited properties');
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleEditClick = () => {
        setEditMode(true);
        setEditName(profile.name || '');
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditName(profile.name || '');
        setEditPhoto(null);
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEditPhoto(e.target.files[0]);
        }
    };

    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            setError('');
            let updatedProfile = { ...profile, name: editName };
            let newProfilePictureUrl = null;
            if (editPhoto) {
                const formData = new FormData();
                formData.append('profilePhoto', editPhoto);
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch('http://localhost:5001/api/auth/upload-profile-photo', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
                    });
                    let data;
                    try {
                        data = await res.json();
                    } catch (jsonErr) {
                        throw new Error('Server error: could not parse response. Check backend logs.');
                    }
                    if (!res.ok) throw new Error(data.message || 'Failed to upload photo');
                    newProfilePictureUrl = data.url;
                    updatedProfile.profilePicture = newProfilePictureUrl;
                } catch (err) {
                    setError('Photo upload failed: ' + (err.message || 'Unknown error'));
                    setLoading(false);
                    return;
                }
            }
            // Update name
            if (editName !== profile.name) {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5001/api/auth/update-profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name: editName })
                });
                if (!res.ok) throw new Error('Failed to update name');
            }
            // Always fetch the latest profile from backend after save
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const freshProfile = await res.json();
                setProfile(freshProfile);
            } else {
                setProfile(updatedProfile);
            }
            setEditMode(false);
            setEditPhoto(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !editMode) return <div className="profile-loading">Loading profile...</div>;
    if (error && !editMode) return <div className="profile-error">{error}</div>;
    if (!profile) return <div className="profile-error">No profile data found.</div>;

    return (
        <div className="profile-container">
            {error && editMode && (
                <div className="profile-error">{error}</div>
            )}
            <div className="profile-card">
                {/* Edit button in top right corner */}
                {!editMode && (
                    <button className="edit-btn-corner" onClick={handleEditClick} title="Edit Profile">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    </button>
                )}
                <div className="profile-main-row">
                    <div className="profile-info">
                        {editMode ? (
                            <>
                                <input className="edit-name-input" value={editName} onChange={e => setEditName(e.target.value)} />
                                <div className="edit-actions">
                                    <button className="save-btn" onClick={handleSaveEdit} disabled={loading}>Save</button>
                                    <button className="cancel-btn" onClick={handleCancelEdit} disabled={loading}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>{profile.name}</h2>
                            </>
                        )}
                        <p className="profile-role">{profile.role?.toUpperCase() || 'USER'}</p>
                        <div className="profile-details">
                            <div><span>Email:</span> {profile.email}</div>
                            {profile.phone && <div><span>Phone:</span> {profile.phone}</div>}
                            <div className="join-date">
                                <span>Member Since:</span>
                                {(() => {
                                    const formatDate = (date) => {
                                        const options = { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        };
                                        return date.toLocaleDateString(undefined, options);
                                    };

                                    const getTimeAgo = (date) => {
                                        const now = new Date();
                                        const diffInSeconds = Math.floor((now - date) / 1000);
                                        
                                        if (diffInSeconds < 60) return 'just now';
                                        
                                        const diffInMinutes = Math.floor(diffInSeconds / 60);
                                        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
                                        
                                        const diffInHours = Math.floor(diffInMinutes / 60);
                                        if (diffInHours < 24) return `${diffInHours}h ago`;
                                        
                                        const diffInDays = Math.floor(diffInHours / 24);
                                        if (diffInDays < 30) return `${diffInDays}d ago`;
                                        
                                        const diffInMonths = Math.floor(diffInDays / 30);
                                        if (diffInMonths < 12) return `${diffInMonths}mo ago`;
                                        
                                        const diffInYears = Math.floor(diffInMonths / 12);
                                        return `${diffInYears}y ago`;
                                    };

                                    let date;
                                    if (profile.createdAt) {
                                        if (typeof profile.createdAt === 'string' || typeof profile.createdAt === 'number') {
                                            date = new Date(profile.createdAt);
                                            if (typeof profile.createdAt === 'string' && isNaN(date.getTime())) {
                                                const asInt = parseInt(profile.createdAt, 10);
                                                if (!isNaN(asInt)) {
                                                    date = new Date(asInt > 1000000000000 ? asInt : asInt * 1000);
                                                }
                                            }
                                        } else if (profile.createdAt._seconds) {
                                            date = new Date(profile.createdAt._seconds * 1000);
                                        }
                                    } else if (profile._id && typeof profile._id === 'string' && profile._id.length === 24) {
                                        const timestampHex = profile._id.substring(0, 8);
                                        const timestamp = parseInt(timestampHex, 16) * 1000;
                                        date = new Date(timestamp);
                                    }

                                    if (date && !isNaN(date.getTime()) && date.getFullYear() > 1970) {
                                        return (
                                            <div className="join-date-content">
                                                <span className="join-date-full" title={formatDate(date)}>
                                                    {formatDate(date)}
                                                </span>
                                                <span className="join-date-ago">
                                                    ({getTimeAgo(date)})
                                                </span>
                                            </div>
                                        );
                                    }
                                    return <span className="join-date-error">Registration date unavailable</span>;
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-section">
                <h3>Properties Listed</h3>
                {listedProperties.length === 0 ? (
                    <div className="profile-empty">No properties listed yet.</div>
                ) : (
                    <div className="profile-properties-list">
                        {listedProperties.map((prop) => (
                            <div className="profile-property-card" key={prop._id}>
                                <Link to={`/property/${prop._id}`} className="property-link">
                                    <img 
                                        src={
                                            prop.images && prop.images[0]
                                                ? (prop.images[0].startsWith('http')
                                                    ? prop.images[0]
                                                    : `http://localhost:5001${prop.images[0]}`)
                                                : '/images/property1.jpg'
                                        } 
                                        alt={prop.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/property1.jpg';
                                        }}
                                    />
                                    <div className="profile-property-info">
                                        <div className="profile-property-title">{prop.title}</div>
                                        <div className="profile-property-location">
                                            <i className="fas fa-map-marker-alt"></i> {prop.location}
                                        </div>
                                        <div className="profile-property-price">₹{prop.price.toLocaleString('en-IN')}</div>
                                        <div className="profile-property-type">{prop.type}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
