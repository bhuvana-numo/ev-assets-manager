const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    
},{ optimisticConcurrency: true });

module.exports = mongoose.model("Location", LocationSchema);
