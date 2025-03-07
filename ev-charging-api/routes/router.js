const express = require("express");
const mongoose = require("mongoose");

const Location = require("../models/Location");
const ChargeStation = require("../models/ChargeStation");
const ChargePoint = require("../models/ChargePoint");
const Connector = require("../models/Connector");

const router = express.Router();

const models = {
    location: Location,
    chargestation: ChargeStation,
    chargepoint: ChargePoint,
    connector: Connector,
};

// 🔹 Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 🔹 CRUD Operations - Reusable Route Handler
const createCRUDRoutes = (route, Model, populateField = null) => {
    // Create
    router.post(`/${route}`, async (req, res) => {
        try {
            const data = new Model(req.body);
            await data.save();
            res.status(201).json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Read all
    router.get(`/${route}`, async (req, res) => {
        try {
            let query = Model.find();
            if (populateField) query = query.populate(populateField);
            const items = await query;
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Read by ID
    router.get(`/${route}/:id`, async (req, res) => {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ error: "`id` must be a valid ObjectId" });
            }

            let query = Model.findById(req.params.id);
            if (populateField) query = query.populate(populateField);
            const item = await query;

            if (!item) return res.status(404).json({ error: "Not found" });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Update
    router.put(`/${route}/:id`, async (req, res) => {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ error: "`id` must be a valid ObjectId" });
            }

            const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!updatedItem) return res.status(404).json({ error: "Not found" });
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Delete
    router.delete(`/${route}/:id`, async (req, res) => {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ error: "`id` must be a valid ObjectId" });
            }

            const deletedItem = await Model.findByIdAndDelete(req.params.id);
            if (!deletedItem) return res.status(404).json({ error: "Not found" });

            res.json({ message: `${route} deleted` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// 🔹 Register Routes for each Model
createCRUDRoutes("location", Location);
createCRUDRoutes("chargestation", ChargeStation, "locationId");
createCRUDRoutes("chargepoint", ChargePoint, "stationId");
createCRUDRoutes("connector", Connector, "chargePointId");

module.exports = router;
