const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    type: {
        type: String,
        enum: ['house', 'apartment', 'villa', 'penthouse', 'land', 'cabin'],
        required: true
    },
    status: {
        type: String,
        enum: ['for-sale', 'for-rent','rented','sold'],
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    yearBuilt: {
        type: Number
    },
    features: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    images: [{
        type: String
    }],
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
propertySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property; 