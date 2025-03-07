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

// 🔹 CRUD actions with debugging
const actions = {
    POST: async (req, Model) => {
        console.log("📌 [POST] Data received:", req.body);
        const data = new Model(req.body);
        await data.save();
        console.log("✅ [POST] Created:", data);
        return { status: 201, data };
    },
    GET: async (req, Model, populateField) => {
        console.log("📌 [GET] Request:", req.params.id ? `ID: ${req.params.id}` : "Fetching all");

        if (req.params.id) {
            if (!isValidObjectId(req.params.id)) return { status: 400, error: "`id` must be a valid ObjectId" };
            let query = Model.findById(req.params.id);
            if (populateField) query = query.populate(populateField);
            const data = await query;
            console.log("📌 [GET] Result:", data);
            return data ? { status: 200, data } : { status: 404, error: "Not found" };
        } else {
            let query = Model.find();
            if (populateField) query = query.populate(populateField);
            const data = await query;
            console.log("📌 [GET] All Results:", data);
            return { status: 200, data };
        }
    },
    PUT: async (req, Model) => {
        console.log("📌 [PUT] Updating ID:", req.params.id, "with Data:", req.body);
        if (!isValidObjectId(req.params.id)) return { status: 400, error: "`id` must be a valid ObjectId" };
        const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        console.log("📌 [PUT] Update Result:", data);
        return data ? { status: 200, data } : { status: 404, error: "Not found" };
    },
    DELETE: async (req, Model) => {
        console.log("📌 [DELETE] Removing ID:", req.params.id);
        if (!isValidObjectId(req.params.id)) return { status: 400, error: "`id` must be a valid ObjectId" };
        const data = await Model.findByIdAndDelete(req.params.id);
        console.log("📌 [DELETE] Delete Result:", data);
        return data ? { status: 200, data: { message: "Deleted successfully" } } : { status: 404, error: "Not found" };
    },
};

// 🔹 Register Routes Dynamically
Object.entries(models).forEach(([route, Model]) => {
    const populateField = populateMap[route] || null;

    ["POST", "GET", "PUT", "DELETE"].forEach((method) => {
        // Fix route conflicts by ensuring correct `id` usage
        const path =
            method === "POST" ? `/${route}` :
            method === "GET" ? `/${route}/:id?` :
            `/${route}/:id`;

        router[method.toLowerCase()](path, async (req, res) => {
            try {
                const result = await actions[method](req, Model, populateField);
                res.status(result.status).json(result.data || { error: result.error });
            } catch (error) {
                console.error("❌ [ERROR] API Issue:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    });
});

module.exports = router;
