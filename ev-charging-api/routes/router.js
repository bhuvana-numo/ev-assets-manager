const express = require("express");
const mongoose = require("mongoose");

const models = {
    location: require("../models/Location"),
    chargestation: require("../models/ChargeStation"),
    chargepoint: require("../models/ChargePoint"),
    connector: require("../models/Connector"),
};

const populateMap = {
    chargestation: "locationId",
    chargepoint: "stationId",
    connector: "chargePointId",
};

const router = express.Router();

// 🔹 Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 🔹 CRUD actions mapping to functions
const actions = {
    POST: async (req, Model) => {
        const data = new Model(req.body);
        await data.save();
        return { status: 201, data };
    },
    GET: async (req, Model, populateField) => {
        if (req.params.id) {
            if (!isValidObjectId(req.params.id)) return { status: 400, error: "`id` must be a valid ObjectId" };
            let query = Model.findById(req.params.id);
            if (populateField) query = query.populate(populateField);
            const data = await query;
            return data ? { status: 200, data } : { status: 404, error: "Not found" };
        } else {
            let query = Model.find();
            if (populateField) query = query.populate(populateField);
            const data = await query;
            return { status: 200, data };
        }
    },
    PUT: async (req, Model) => {
        if (!isValidObjectId(req.params.id)) return { status: 400, error: "`id` must be a valid ObjectId" };
        const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        return data ? { status: 200, data } : { status: 404, error: "Not found" };
    },
    DELETE: async (req, Model) => {
        if (!isValidObjectId(req.params.id)) return { status: 400, error: "`id` must be a valid ObjectId" };
        const data = await Model.findByIdAndDelete(req.params.id);
        return data ? { status: 200, data: { message: "Deleted successfully" } } : { status: 404, error: "Not found" };
    },
};

// 🔹 Loop through models & dynamically register routes
Object.entries(models).forEach(([route, Model]) => {
    const populateField = populateMap[route] || null;

    ["POST", "GET", "PUT", "DELETE"].forEach((method) => {
        const path = method === "GET" || method === "PUT" || method === "DELETE" ? `/${route}/:id?` : `/${route}`;
        router[method.toLowerCase()](path, async (req, res) => {
            try {
                const result = await actions[method](req, Model, populateField);
                res.status(result.status).json(result.data || { error: result.error });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    });
});

module.exports = router;
