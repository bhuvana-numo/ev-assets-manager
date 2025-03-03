const mongoose = require("mongoose");

const ChargePointSchema = new mongoose.Schema({
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: "ChargeStation", required: true },
    type: String
});


module.exports = mongoose.model("ChargePoint", ChargePointSchema);
