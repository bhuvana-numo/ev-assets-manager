const mongoose = require("mongoose");

const ConnectorSchema = new mongoose.Schema({
    chargePointId: { type: mongoose.Schema.Types.ObjectId, ref: "ChargePoint" },
    power: Number
});

module.exports = mongoose.model("Connector", ConnectorSchema);
