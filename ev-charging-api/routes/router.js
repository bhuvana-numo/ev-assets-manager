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

// 🔹 Generic GET handler with optional filtering
const fetchData = async (Model, filter = {}, populateField = null) => {
    let query = Model.find(filter);
    if (populateField) query = query.populate(populateField);
    return await query;
};

// 🔹 CRUD actions with debugging
const actions = {
    POST: async (req, Model) => {
        try {
            const data = new Model(req.body);
            await data.save();
            return { status: 201, data };
        } catch (error) {
            return {
                status: error.name === "ValidationError" ? 400 : 500,
                error: error.message,
            };
        }
    },
    GET: async (req, Model, populateField) => {
        if (req.params.id) {
            if (!isValidObjectId(req.params.id)) return { status: 400, error: "Invalid ObjectId" };
            let query = Model.findById(req.params.id);
            if (populateField) query = query.populate(populateField);
            const data = await query;
            return data ? { status: 200, data } : { status: 404, error: "Not found" };
        } else {
            return { status: 200, data: await fetchData(Model, {}, populateField) };
        }
    },
    PUT: async (req, Model) => {
        if (!isValidObjectId(req.params.id)) return { status: 400, error: "Invalid ObjectId" };
        const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        return data ? { status: 200, data } : { status: 404, error: "Not found" };
    },
    DELETE: async (req, Model) => {
        if (!isValidObjectId(req.params.id)) return { status: 400, error: "Invalid ObjectId" };
        const data = await Model.findByIdAndDelete(req.params.id);
        return data ? { status: 200, data: { message: "Deleted successfully" } } : { status: 404, error: "Not found" };
    },
};

// 🔹 Register CRUD routes dynamically
Object.entries(models).forEach(([route, Model]) => {
    const populateField = populateMap[route] || null;

    ["POST", "GET", "PUT", "DELETE"].forEach((method) => {
        const path =
            method === "POST" ? `/${route}` :
            method === "GET" ? `/${route}/:id?` :
            `/${route}/:id`;

        router[method.toLowerCase()](path, async (req, res) => {
            try {
                const result = await actions[method](req, Model, populateField);
                res.status(result.status).json(result.data || { error: result.error });
            } catch (error) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    });
});

// 🔹 Additional Routes (Filter-based Queries)
const dynamicRoutes = [
    { route: "chargestations-by-location", model: "chargestation", field: "locationId" },
    { route: "chargepoints-by-location", model: "chargepoint", field: "locationId" },
    { route: "chargepoints-by-station", model: "chargepoint", field: "stationId" },
    { route: "connectors-by-location", model: "connector", field: "locationId" },
    { route: "connectors-by-chargepoint", model: "connector", field: "chargePointId" },
    { route: "connectors-by-chargestation", model: "connector", field: "stationId" },
];

// 🔹 Register dynamic filtering routes
dynamicRoutes.forEach(({ route, model, field }) => {
    router.get(`/${route}/:id`, async (req, res) => {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ error: "Invalid ObjectId" });
            }
            const data = await fetchData(models[model], { [field]: req.params.id });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

module.exports = router;
