const express = require('express');
const ChargeStation = require('../models/ChargeStation');
const router = express.Router();

// Create a new Charge Station
router.post('/', async (req, res) => {
    try {
        const chargeStation = new ChargeStation(req.body);
        await chargeStation.save();
        res.status(201).json(chargeStation);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error:err.message });
    }
});

// Get all Charge Stations 
router.get('/', async (req, res) => {
    try {
        const chargeStations = await ChargeStation.find().populate('locationId');
        res.json(chargeStations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: err.message });
    }
});

// Get a specific Charge Station by ID
router.get('/:id', async (req, res) => {
    try {
        const chargeStation = await ChargeStation.findById(req.params.id).populate('locationId');
        if (!chargeStation) {
            return res.status(404).json({ error:err.message});
        }
        res.json(chargeStation);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error:err.message});
    }
});
//Updata a charge station
router.put('/:id', async (req, res) => {
    try {
        const updatedChargeStation = await ChargeStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChargeStation);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error:err.message});
    }
});

// Delete a Charge Station
router.delete('/:id', async (req, res) => {
    try {
        const deletedChargeStation = await ChargeStation.findByIdAndDelete(req.params.id);
        res.json({ message: "Charge Station deleted" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error:err.message});
    }
});

module.exports = router;
