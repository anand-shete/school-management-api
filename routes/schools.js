const express = require('express');
const router = express.Router();
const db = require('../connect');

// Add School API
router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude === undefined || longitude === undefined)
        return res.status(400).json({ message: 'All fields are required.' });

    try {
        await db.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// List Schools API
router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: 'Latitude and Longitude are required.' });
    }

    try {
        const [schools] = await db.query('SELECT * FROM schools');
        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

        // Calculate distance using Haversine formula
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Earth's radius in km
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                school.latitude,
                school.longitude
            ),
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/getAllSchools', async (req, res) => {
    try {
        const [schools] = await db.query('SELECT * FROM schools');
        res.status(200).json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;