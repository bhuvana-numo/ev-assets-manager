const mongoose = require("mongoose");

const ConnectorSchema = new mongoose.Schema({
    chargePointId: { type: mongoose.Schema.Types.ObjectId, ref: "ChargePoint", required: true },
    power: Number
});

module.exports = mongoose.model("Connector", ConnectorSchema);
