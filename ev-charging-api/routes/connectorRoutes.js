const express = require("express");
const mongoose = require("mongoose");
const Connector = require("../models/Connector");

const router = express.Router();

// Create a new Connector
router.post("/", async (req, res) => {
    try {
        const { chargePointId, power } = req.body;

        if (!chargePointId || !mongoose.Types.ObjectId.isValid(chargePointId)) {
            return res.status(400).json({ error: "`chargePointId` must be a valid ObjectId" });
        }
        if (power == null || typeof power !== "number" || power <= 0) {
            return res.status(400).json({ error: "`power` must be a positive number" });
        }

        const connector = new Connector({ chargePointId, power });
        await connector.save();
        res.status(201).json(connector);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Get all Connectors
router.get("/", async (req, res) => {
    try {
        const connectors = await Connector.find().populate("chargePointId");
        res.json(connectors);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Get a specific Connector by ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "`id` must be a valid ObjectId" });
        }

        const connector = await Connector.findById(req.params.id).populate("chargePointId");
        if (!connector) {
            return res.status(404).json({ error: "Connector not found" });
        }
        res.json(connector);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Update a Connector by ID
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "`id` must be a valid ObjectId" });
        }

        if (req.body.chargePointId && !mongoose.Types.ObjectId.isValid(req.body.chargePointId)) {
            return res.status(400).json({ error: "`chargePointId` must be a valid ObjectId" });
        }

        const updatedConnector = await Connector.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedConnector) {
            return res.status(404).json({ error: "Connector not found" });
        }

        res.json(updatedConnector);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Delete a Connector by ID
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "`id` must be a valid ObjectId" });
        }

        const deletedConnector = await Connector.findByIdAndDelete(req.params.id);
        if (!deletedConnector) {
            return res.status(404).json({ error: "Connector not found" });
        }
        res.json({ message: "Connector deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

module.exports = router;
