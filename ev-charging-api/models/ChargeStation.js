const mongoose = require("mongoose");

const ChargeStationSchema = new mongoose.Schema({
    name: String,
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }
});

module.exports = mongoose.model("ChargeStation", ChargeStationSchema);
