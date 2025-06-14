const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all properties with filters
router.get('/', async (req, res) => {
    try {
        const {
            type,
            status,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            location,
            sortBy,
            limit = 10,
            page = 1
        } = req.query;

        // Build filter object
        const filter = {};
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (bedrooms) filter.bedrooms = Number(bedrooms);
        if (bathrooms) filter.bathrooms = Number(bathrooms);
        if (location) filter.location = new RegExp(location, 'i');

        // Build sort object
        const sort = {};
        if (sortBy) {
            const [field, order] = sortBy.split(':');
            sort[field] = order === 'desc' ? -1 : 1;
        }

        // Get paginated results
        const properties = await Property.find(filter)
            .sort(sort)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .populate('agent', 'name email phone')
            .populate('owner', 'name email phone');

        const total = await Property.countDocuments(filter);

        res.json({
            properties,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error: error.message });
    }
});

// Get single property
router.get('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('agent', 'name email phone')
            .populate('owner', 'name email phone');

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Increment views
        property.views += 1;
        await property.save();

        // Add property to user's visited properties if not already there
        const user = await User.findById(req.user._id);
        if (user) {
            if (!user.visitedProperties.includes(property._id)) {
                user.visitedProperties.push(property._id);
                // Keep only the last 20 visited properties
                if (user.visitedProperties.length > 20) {
                    user.visitedProperties = user.visitedProperties.slice(-20);
                }
                await user.save();
            }
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property', error: error.message });
    }
});

// Create new property (requires authentication)
router.post('/', auth, async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = [
            'title', 'description', 'price', 'location', 'type', 'status', 'bedrooms', 'bathrooms', 'area', 'address', 'owner', 'agent'
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }
        // Create property
        const property = new Property({
            ...req.body,
            agent: req.user._id,
            owner: req.user._id
        });
        await property.save();
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error creating property', error: error.message });
    }
});

// Update property (requires authentication)
router.put('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is authorized
        if (property.agent.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedProperty);
    } catch (error) {
        res.status(500).json({ message: 'Error updating property', error: error.message });
    }
});

// Delete property (requires authentication)
router.delete('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user is authorized
        if (property.agent.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error: error.message });
    }
});

// Get featured properties
router.get('/featured', async (req, res) => {
    try {
        const properties = await Property.find({ isFeatured: true })
            .limit(6)
            .populate('agent', 'name email phone')
            .populate('owner', 'name email phone');

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured properties', error: error.message });
    }
});

// Get properties by agent
router.get('/agent/:agentId', async (req, res) => {
    try {
        const properties = await Property.find({ agent: req.params.agentId })
            .populate('agent', 'name email phone')
            .populate('owner', 'name email phone');

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agent properties', error: error.message });
    }
});

// Get properties by owner
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.params.ownerId })
            .populate('agent', 'name email phone')
            .populate('owner', 'name email phone');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching owner properties', error: error.message });
    }
});

// Get visited properties
router.post('/visited', auth, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: 'Invalid property IDs' });
        }

        const properties = await Property.find({
            _id: { $in: ids }
        }).select('title location price images type');

        // Sort properties to match the order of visited IDs
        const sortedProperties = ids.map(id => 
            properties.find(prop => prop._id.toString() === id)
        ).filter(Boolean);

        res.json(sortedProperties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching visited properties', error: error.message });
    }
});

module.exports = router;