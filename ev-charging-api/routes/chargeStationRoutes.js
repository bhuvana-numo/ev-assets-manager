const express = require('express');
const ChargeStation = require('../models/ChargeStation');
const router = express.Router();

// Create a new Charge Station
router.post('/', async (req, res) => {
    const chargeStation = new ChargeStation(req.body);
    await chargeStation.save();
    res.status(201).json(chargeStation);
});

// Get all Charge Stations (with location details)
router.get('/', async (req, res) => {
    const chargeStations = await ChargeStation.find().populate('locationId');
    res.json(chargeStations);
});

// Get a specific Charge Station by ID
router.get('/:id', async (req, res) => {
    const chargeStation = await ChargeStation.findById(req.params.id).populate('locationId');
    res.json(chargeStation);
});

// Update a Charge Station
router.put('/:id', async (req, res) => {
    const updatedChargeStation = await ChargeStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedChargeStation);
});

// Delete a Charge Station
router.delete('/:id', async (req, res) => {
    await ChargeStation.findByIdAndDelete(req.params.id);
    res.json({ message: "Charge Station deleted" });
});

module.exports = router;
