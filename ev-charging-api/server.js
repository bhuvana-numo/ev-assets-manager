const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const locationRoutes = require("./routes/locationRoutes");
const chargeStationRoutes = require('./routes/chargeStationRoutes');
const chargePointRoutes = require('./routes/chargePointRoutes');
const connectorRoutes = require('./routes/connectorRoutes');

const app = express();
connectDB(); // Connect to MongoDB


app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/locations", locationRoutes);
app.use('/chargeStations', chargeStationRoutes);
app.use('/chargePoints', chargePointRoutes);
app.use('/connectors', connectorRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
