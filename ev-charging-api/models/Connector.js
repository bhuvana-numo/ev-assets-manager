const mongoose = require("mongoose");

const ConnectorSchema = new mongoose.Schema({
    chargePointId: { type: mongoose.Schema.Types.ObjectId, ref: "ChargePoint", required: true },
    power: {type:Number, required:true}
},{ optimisticConcurrency: true });

module.exports = mongoose.model("Connector", ConnectorSchema);
