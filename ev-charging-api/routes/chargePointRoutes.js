const express = require('express');
const ChargePoint = require('../models/ChargePoint');
const router = express.Router();

// Create a new Charge Point
router.post('/', async (req, res) => {
    try {
        const { stationId, type } = req.body;

        if (!stationId) {
            return res.status(400).json({ error: "`stationId` is required" });
        }
        if (!type) {
            return res.status(400).json({ error: "`type` is required" });
        }

        const chargePoint = new ChargePoint({ stationId, type });
        await chargePoint.save();
        res.status(201).json(chargePoint);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Get all Charge Points (with charge station details)
router.get('/', async (req, res) => {
    try {
        const chargePoints = await ChargePoint.find().populate('stationId');
        res.json(chargePoints);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Get a specific Charge Point by ID
router.get('/:id', async (req, res) => {
    try {
        const chargePoint = await ChargePoint.findById(req.params.id).populate('stationId');
        if (!chargePoint) {
            return res.status(404).json({ error: "Charge Point not found" });
        }
        res.json(chargePoint);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Update a Charge Point
router.put('/:id', async (req, res) => {
    try {
        const updatedChargePoint = await ChargePoint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedChargePoint) {
            return res.status(404).json({ error: "Charge Point not found" });
        }
        res.json(updatedChargePoint);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Delete a Charge Point
router.delete('/:id', async (req, res) => {
    try {
        const deletedChargePoint = await ChargePoint.findByIdAndDelete(req.params.id);
        if (!deletedChargePoint) {
            return res.status(404).json({ error: "Charge Point not found" });
        }
        res.json({ message: "Charge Point deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

module.exports = router;
