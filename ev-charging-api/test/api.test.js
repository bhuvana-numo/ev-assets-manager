const app = require("../server");
const mongoose = require("mongoose");
const { sendRequest, validateResponse } = require("./testapiResponse");
const Location = require("../models/Location");
const ChargeStation = require("../models/ChargeStation");
const ChargePoint = require("../models/ChargePoint");
const Connector = require("../models/Connector");
const testData = require("./testData");


describe("API Tests for All Collections", function () {
    this.timeout(10000);

    before(async function () {
        await mongoose.connection.dropDatabase();
    
        // ✅ Create Location first
        const location = await Location.create(testData.location);
        testData.chargeStation.locationId = location._id;  // Set correct ObjectId
    
        // ✅ Create ChargeStation next
        const chargeStation = await ChargeStation.create(testData.chargeStation);
        testData.chargePoint.stationId = chargeStation._id;  // Set correct ObjectId
    
        // ✅ Create ChargePoint next
        const chargePoint = await ChargePoint.create(testData.chargePoint);
        testData.connector.chargePointId = chargePoint._id;  // Set correct ObjectId
    
        // ✅ Finally, create Connector
        await Connector.create(testData.connector);
    });
    
    after(async function () {
        await mongoose.connection.close();
    });

    const apiTests = [
        { name: "Location", type: "location", data: testData.location },
        { name: "ChargeStation", type: "chargestation", data: testData.chargeStation },
        { name: "ChargePoint", type: "chargepoint", data: testData.chargePoint },
        { name: "Connector", type: "connector", data: testData.connector }
    ];

    apiTests.forEach(({ name, type, data }) => {
        describe(`${name} API`, () => {
            let createdId;

            const endpoint = `/${type}`;


            it(`should create a new ${name.toLowerCase()}`, async () => {
                const res = await sendRequest(app, "post", endpoint, 201, data);
                validateResponse(res, data);
                createdId = res.body._id;
            });

            it(`should fetch all ${name.toLowerCase()}s`, async () => {
                await sendRequest(app, "get", endpoint, 200);
            });

            it(`should fetch a single ${name.toLowerCase()} by ID`, async () => {
                await sendRequest(app, "get", `${endpoint}/${createdId}`, 200);
            });

            it(`should update the ${name.toLowerCase()}`, async () => {
                const updatedData = { ...data, name: `${data.name} Updated` };
                await sendRequest(app, "put", `${endpoint}/${createdId}`, 200, updatedData);
            });

            it(`should delete the ${name.toLowerCase()}`, async () => {
                await sendRequest(app, "delete", `${endpoint}/${createdId}`, 200);
            });

            it(`should return 400 for non-existing ${name.toLowerCase()}`, async () => {
                await sendRequest(app, "get", `${endpoint}/non_existing_id`, 400);
            });
        });
    });
});