const { mongoose, expect } = require("./setup");
const Location = require("../models/Location");
const ChargeStation = require("../models/ChargeStation");
const ChargePoint = require("../models/ChargePoint");
const Connector = require("../models/Connector");
const testApiResponse = require("./testapiresponse.js");

describe("Connectors API", () => {
    let location, chargeStation, chargePoint, connector;

    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await Connector.deleteMany({});
        await ChargePoint.deleteMany({});
        await ChargeStation.deleteMany({});
        await Location.deleteMany({});

        // **1. Create Location**
        const locationResponse = await testApiResponse(
            "location",
            "POST",
            "/locations",
            { name: "Test Location", city: "Test City", country: "Test Country" },
            { name: "Test Location", city: "Test City", country: "Test Country" },
            201
        );
        location = locationResponse.body;

        // **2. Create Charge Station**
        const chargeStationResponse = await testApiResponse(
            "chargeStation",
            "POST",
            "/chargeStations",
            { name: "Test Station", locationId: location._id },
            { name: "Test Station", locationId: location._id },
            201
        );
        chargeStation = chargeStationResponse.body;

        // **3. Create Charge Point**
        const chargePointResponse = await testApiResponse(
            "chargePoint",
            "POST",
            "/chargePoints",
            { stationId: chargeStation._id, type: "Fast Charger" },
            { stationId: chargeStation._id, type: "Fast Charger" },
            201
        );
        chargePoint = chargePointResponse.body;

        // **4. Create Connector**
        connector = new Connector({ chargePointId: chargePoint._id, power: 22 });
        await connector.save();
    });

    describe("GET /connectors", () => {
        it("should GET all connectors", async () => {
            const res = await testApiResponse("connector", "GET", "/connectors", {}, {
                chargePointId: connector.chargePointId.toString(),
                power: connector.power,
            }, 200);
            expect(res.body).to.be.an("array");
        });
    });

    describe("POST /connectors", () => {
        it("should POST a new connector", async () => {
            const newConnector = { chargePointId: chargePoint._id, power: 50 };

            const res = await testApiResponse("connector", "POST", "/connectors", newConnector, newConnector, 201);

            expect(res.body).to.have.property("_id");
        });
    });

    describe("GET /connectors/:id", () => {
        it("should GET a connector by ID", async () => {
            const res = await testApiResponse("connector", "GET", `/connectors/${connector._id}`, {}, {
                chargePointId: connector.chargePointId.toString(),
                power: connector.power,
            }, 200);
            expect(res.body).to.have.property("_id").that.equals(connector._id.toString());
        });
    });

    describe("PUT /connectors/:id", () => {
        it("should UPDATE a connector given the id", async () => {
            const updatedData = {
                chargePointId: connector.chargePointId.toString(),
                power: 75
            };

            const res = await testApiResponse("connector", "PUT", `/connectors/${connector._id}`, updatedData, updatedData, 200);
        });
    });

    describe("DELETE /connectors/:id", () => {
        it("should DELETE a connector given the id", async () => {
            const res = await testApiResponse("connector", "DELETE", `/connectors/${connector._id}`, {}, null, 200);

            expect(res.body).to.have.property("message").that.equals("Connector deleted");

            const checkConnector = await Connector.findById(connector._id);
            expect(checkConnector).to.be.null;
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
