const express = require('express');
const Connector = require('../models/Connector');
const router = express.Router();

// Create a new Connector
router.post('/', async (req, res) => {
    const connector = new Connector(req.body);
    await connector.save();
    res.status(201).json(connector);
});

// Get all Connectors (with charge point details)
router.get('/', async (req, res) => {
    const connectors = await Connector.find().populate('chargePointId');
    res.json(connectors);
});

// Get a specific Connector by ID
router.get('/:id', async (req, res) => {
    const connector = await Connector.findById(req.params.id).populate('chargePointId');
    res.json(connector);
});

// Update a Connector
router.put('/:id', async (req, res) => {
    const updatedConnector = await Connector.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedConnector);
});

// Delete a Connector
router.delete('/:id', async (req, res) => {
    await Connector.findByIdAndDelete(req.params.id);
    res.json({ message: "Connector deleted" });
});

module.exports = router;
