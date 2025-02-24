const express = require('express');
const ChargePoint = require('../models/ChargePoint');
const router = express.Router();

// Create a new Charge Point
router.post('/', async (req, res) => {
    const chargePoint = new ChargePoint(req.body);
    await chargePoint.save();
    res.status(201).json(chargePoint);
});

// Get all Charge Points (with charge station details)
router.get('/', async (req, res) => {
    const chargePoints = await ChargePoint.find().populate('stationId');
    res.json(chargePoints);
});

// Get a specific Charge Point by ID
router.get('/:id', async (req, res) => {
    const chargePoint = await ChargePoint.findById(req.params.id).populate('stationId');
    res.json(chargePoint);
});

// Update a Charge Point
router.put('/:id', async (req, res) => {
    const updatedChargePoint = await ChargePoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedChargePoint);
});

// Delete a Charge Point
router.delete('/:id', async (req, res) => {
    await ChargePoint.findByIdAndDelete(req.params.id);
    res.json({ message: "Charge Point deleted" });
});

module.exports = router;
