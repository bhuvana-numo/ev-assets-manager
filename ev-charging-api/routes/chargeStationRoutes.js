const express = require('express');
const ChargeStation = require('../models/ChargeStation');
const router = express.Router();

// Create a new Charge Station
router.post('/', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: "`name` is required" });  // ✅ Matching test case
        }
        const chargeStation = new ChargeStation(req.body);
        await chargeStation.save();
        res.status(201).json(chargeStation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all Charge Stations (with location details)
router.get('/', async (req, res) => {
    try {
        const chargeStations = await ChargeStation.find().populate('locationId');
        res.json(chargeStations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get a specific Charge Station by ID
router.get('/:id', async (req, res) => {
    try {
        const chargeStation = await ChargeStation.findById(req.params.id).populate('locationId');
        if (!chargeStation) {
            return res.status(404).json({ error: "Charge Station not found" });
        }
        res.json(chargeStation);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid ID format" });
    }
});

router.get("/location/:locationId", async (req, res) => {
    try {
        const chargeStations = await ChargeStation.find({ locationId: req.params.locationId });
        res.json(chargeStations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching charge stations", error });
    }
});


// Update a Charge Station
router.put('/:id', async (req, res) => {
    try {
        const allowedUpdates = ['name', 'locationId'];
        const updateKeys = Object.keys(req.body);
        const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            return res.status(400).json({ error: "Invalid field" });  // ✅ Matching test case
        }

        const updatedChargeStation = await ChargeStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedChargeStation) {
            return res.status(404).json({ error: "Charge Station not found" });
        }
        res.json(updatedChargeStation);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid ID format" });
    }
});

// Delete a Charge Station
router.delete('/:id', async (req, res) => {
    try {
        const deletedChargeStation = await ChargeStation.findByIdAndDelete(req.params.id);
        if (!deletedChargeStation) {
            return res.status(404).json({ error: "Charge Station not found" });
        }
        res.json({ message: "Charge Station deleted" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid ID format" });
    }
});

module.exports = router;
