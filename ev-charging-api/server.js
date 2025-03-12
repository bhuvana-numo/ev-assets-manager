const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const router = require("./routes/router"); // ✅ Import the merged router

const app = express();
connectDB();


app.use(bodyParser.json());


app.use("/", router);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
