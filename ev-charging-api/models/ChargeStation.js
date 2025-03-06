const mongoose = require("mongoose");

const ChargeStationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location",required:true }
});

module.exports = mongoose.model("ChargeStation", ChargeStationSchema);
