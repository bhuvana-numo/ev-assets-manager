const app = require("../server");
const mongoose = require("mongoose");
const { sendRequest, validateResponse } = require("./testapiresponse.js");
const Location = require("../models/Location");
const ChargeStation = require("../models/ChargeStation");
const ChargePoint = require("../models/ChargePoint");
const Connector = require("../models/Connector");
const testData = require("./testData");

describe("API Tests for All Collections", function () {
    this.timeout(15000);

    beforeEach(async function () {
        // Instead of dropping the whole database, clear only relevant collections
        await Location.deleteMany({});
        await ChargeStation.deleteMany({});
        await ChargePoint.deleteMany({});
        await Connector.deleteMany({});
    });

    after(async function () {
        await mongoose.connection.close();
    });

    const apiTests = [
        { name: "Location", type: "location", model: Location, data: testData.location },
        { name: "ChargeStation", type: "chargestation", model: ChargeStation, data: testData.chargeStation },
        { name: "ChargePoint", type: "chargepoint", model: ChargePoint, data: testData.chargePoint },
        { name: "Connector", type: "connector", model: Connector, data: testData.connector }
    ];

    apiTests.forEach(({ name, type, model, data }) => {
        describe(`${name} API`, () => {
            let createdId;
            let dependentIds = {};

            beforeEach(async () => {
                dependentIds = {}; //Initialize to prevent undefined errors

                // Create required dependencies
                const location = await Location.create(testData.location);
                dependentIds.locationId = location._id;

                if (name !== "Location") {
                    const chargeStation = await ChargeStation.create({
                        ...testData.chargeStation,
                        locationId: dependentIds.locationId // ✅ Use from dependentIds
                    });
                    dependentIds.stationId = chargeStation._id;
                }

                if (name === "ChargePoint" || name === "Connector") {
                    if (!dependentIds.stationId) {
                        throw new Error("[ERROR] stationId is undefined! Check if ChargeStation was created.");
                    }
                    const chargePoint = await ChargePoint.create({
                        ...testData.chargePoint,
                        stationId: dependentIds.stationId // ✅ Ensure stationId exists
                    });
                    dependentIds.chargePointId = chargePoint._id;
                }

                if (name === "Connector") {
                    if (!dependentIds.chargePointId) {
                        throw new Error("[ERROR] chargePointId is undefined! Check if ChargePoint was created.");
                    }
                    const connector = await Connector.create({
                        ...testData.connector,
                        chargePointId: dependentIds.chargePointId // ✅ Ensure chargePointId exists
                    });
                    createdId = connector._id;
                } else {
                    const item = await model.create({ ...data, ...dependentIds });
                    createdId = item._id;
                }

                console.log(`[DEBUG] Created ${name} ID: ${createdId}`);
            });

            const endpoint = `/${type}`;

            it(`should create a new ${name.toLowerCase()}`, async () => {
                let filteredDependentIds = { ...dependentIds };
            
                if (name === "Connector") {
                    delete filteredDependentIds.connectorId;
                    delete filteredDependentIds.stationId;
                    delete filteredDependentIds.locationId;
                } else if (name === "ChargePoint") {
                    delete filteredDependentIds.chargePointId;
                    delete filteredDependentIds.locationId;
                } else if (name === "ChargeStation") {
                    delete filteredDependentIds.stationId;
                }
                else{
                    delete filteredDependentIds.locationId;
                }
            
                const res = await sendRequest(app, "post", endpoint, 201, { ...data, ...filteredDependentIds });
            
                validateResponse(res, { ...data, ...filteredDependentIds });
            });
            

            it(`should fetch all ${name.toLowerCase()}s`, async () => {
                await sendRequest(app, "get", endpoint, 200);
            });

            it(`should fetch a single ${name.toLowerCase()} by ID`, async () => {
                console.log(`[DEBUG] Fetching ${name} ID: ${createdId}`);
                await sendRequest(app, "get", `${endpoint}/${createdId}`, 200);
            });

            it(`should update the ${name.toLowerCase()}`, async () => {
                const updatedData = { name: `${data.name} Updated` };
                await sendRequest(app, "put", `${endpoint}/${createdId}`, 200, updatedData);
            });

            it(`should delete the ${name.toLowerCase()}`, async () => {
                await sendRequest(app, "delete", `${endpoint}/${createdId}`, 200);
            });

            // Invalid and non-existent ID tests
            const invalidId = "invalid_id";
            const nonExistentId = "65f123456789012345678901";

            ["get", "put", "delete"].forEach((method) => {
                it(`should return 400 for ${method.toUpperCase()} request with invalid ${name.toLowerCase()} id`, async () => {
                    const requestData = method === "put" ? { name: "UpdatedName" } : undefined;
                    await sendRequest(app, method, `${endpoint}/${invalidId}`, 400, requestData);
                });

                it(`should return 404 for ${method.toUpperCase()} request with non-existent ${name.toLowerCase()} id`, async () => {
                    const requestData = method === "put" ? { name: "UpdatedName" } : undefined;
                    await sendRequest(app, method, `${endpoint}/${nonExistentId}`, 404, requestData);
                });
            });

            it(`should return an empty array if no ${name.toLowerCase()} exists`, async () => {
                await model.deleteMany({});
                const res = await sendRequest(app, "get", endpoint, 200);
                if (!Array.isArray(res.body) || res.body.length !== 0) {
                    throw new Error(`Expected empty array, found ${res.body.length} items`);
                }
            });

            // Concurrent operations
            it("should handle concurrent database access", async () => {
                const fetch1 = sendRequest(app, "get", `${endpoint}/${createdId}`, 200);
                const fetch2 = sendRequest(app, "get", `${endpoint}/${createdId}`, 200);
                await Promise.all([fetch1, fetch2]);
            });

            it("should handle concurrent updates correctly", async () => {
                const update1 = sendRequest(app, "put", `${endpoint}/${createdId}`, 200, { name: "Update1" });
                const update2 = sendRequest(app, "put", `${endpoint}/${createdId}`, 200, { name: "Update2" });
                await Promise.all([update1, update2]);

                const finalRes = await sendRequest(app, "get", `${endpoint}/${createdId}`, 200);
                console.log(`[TEST] Final Name after concurrent updates: ${finalRes.body.name}`);
            });

            it("should handle concurrent deletions correctly", async () => {
                const delete1 = sendRequest(app, "delete", `${endpoint}/${createdId}`, 200);
                const delete2 = sendRequest(app, "delete", `${endpoint}/${createdId}`, 404);
                await Promise.all([delete1, delete2]);
            });
        });
    });
});
