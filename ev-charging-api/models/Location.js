const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    name: String,
    city: String,
    country: String
});

module.exports = mongoose.model("Location", LocationSchema);
