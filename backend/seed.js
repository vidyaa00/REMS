const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');

const defaultProperties = [
    {
        title: "Modern Villa with Pool",
        description: "Beautiful modern villa with a private pool and stunning ocean views. Perfect for families or those who love to entertain.",
        price: 750000,
        location: "Miami",
        address: {
            street: "123 Ocean Drive",
            city: "Miami",
            state: "FL",
            zipCode: "33139",
            country: "USA"
        },
        type: "house",
        status: "for-sale",
        bedrooms: 4,
        bathrooms: 3,
        area: 3500,
        yearBuilt: 2015,
        features: ["Pool", "Ocean View", "Smart Home", "Garden"],
        amenities: ["Swimming Pool", "Gym", "Security System", "Parking"],
        images: [
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff"
        ],
        isFeatured: true
    },
    {
        title: "Downtown Apartment",
        description: "Luxurious apartment in the heart of downtown with amazing city views and modern amenities.",
        price: 450000,
        location: "New York",
        address: {
            street: "456 Broadway",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA"
        },
        type: "apartment",
        status: "for-sale",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        yearBuilt: 2018,
        features: ["City View", "Modern Kitchen", "Walk-in Closet"],
        amenities: ["Concierge", "Gym", "Parking", "Rooftop Deck"],
        images: [
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff"
        ],
        isFeatured: true
    },
    {
        title: "Luxury Beachfront Condo",
        description: "Stunning beachfront condo with direct ocean access and premium finishes throughout.",
        price: 1200000,
        location: "Los Angeles",
        address: {
            street: "789 Beach Blvd",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "USA"
        },
        type: "condo",
        status: "for-sale",
        bedrooms: 3,
        bathrooms: 3,
        area: 2500,
        yearBuilt: 2020,
        features: ["Ocean View", "Private Beach Access", "Smart Home"],
        amenities: ["Pool", "Gym", "Security", "Parking", "Concierge"],
        images: [
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff"
        ],
        isFeatured: true
    },
    {
        title: "Cozy Family Home",
        description: "Charming family home in a quiet neighborhood with a large backyard and modern updates.",
        price: 550000,
        location: "Miami",
        address: {
            street: "321 Pine Street",
            city: "Miami",
            state: "FL",
            zipCode: "33133",
            country: "USA"
        },
        type: "house",
        status: "for-sale",
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        yearBuilt: 2010,
        features: ["Backyard", "Modern Kitchen", "Fireplace"],
        amenities: ["Garage", "Garden", "Storage"],
        images: [
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff",
            "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff"
        ],
        isFeatured: false
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/real-estate', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create a default admin user
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        if (!adminUser) {
            const newAdmin = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin'
            });
            await newAdmin.save();
        }

        // Get the admin user ID
        const admin = await User.findOne({ email: 'admin@example.com' });

        // Add properties
        for (const property of defaultProperties) {
            const existingProperty = await Property.findOne({ title: property.title });
            if (!existingProperty) {
                const newProperty = new Property({
                    ...property,
                    agent: admin._id,
                    owner: admin._id
                });
                await newProperty.save();
                console.log(`Added property: ${property.title}`);
            }
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 