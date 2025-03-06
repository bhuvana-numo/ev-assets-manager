const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// **CREATE**: Add a new location
router.post("/", async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json(location);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// **READ**: Get all locations
router.get("/", async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **READ**: Get a single location by ID

router.get("/:id", async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ error: err.message });
        }
        res.json(location);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// **UPDATE**: Update a location by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLocation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// **DELETE**: Delete a location by ID
router.delete("/:id", async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.json({ message: "Location deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;