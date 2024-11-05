// routes/communities.js
const express = require('express');
const router = express.Router();
const Community = require('../models/Community');

// Obtener todas las comunidades
router.get('/', async (req, res) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching communities' });
    }
});

// Obtener comunidad por ID
router.get('/:id', async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) return res.status(404).json({ message: 'Community not found' });
        res.json(community);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community' });
    }
});

// Crear una nueva comunidad
router.post('/', async (req, res) => {
    const community = new Community(req.body);
    try {
        const savedCommunity = await community.save();
        res.status(201).json(savedCommunity);
    } catch (error) {
        res.status(400).json({ message: 'Error creating community' });
    }
});

module.exports = router;
