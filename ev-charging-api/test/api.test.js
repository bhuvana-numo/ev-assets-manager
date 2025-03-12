const app = require("../server");
const mongoose = require("mongoose");
const { sendRequest} = require("./testapiresponse.js");
const Location = require("../models/Location");
const ChargeStation = require("../models/ChargeStation");
const ChargePoint = require("../models/ChargePoint");
const Connector = require("../models/Connector");
const testData = require("./testData");

describe("API Tests for All Collections", function () {
    this.timeout(15000);

    beforeEach(async function () {
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
                dependentIds = {};

                const location = await Location.create(testData.location);
                dependentIds.locationId = location._id;

                if (name !== "Location") {
                    const chargeStation = await ChargeStation.create({
                        ...testData.chargeStation,
                        locationId: dependentIds.locationId
                    });
                    dependentIds.stationId = chargeStation._id;
                }

                if (name === "ChargePoint" || name === "Connector") {
                    if (!dependentIds.stationId) {
                        throw new Error("[ERROR] stationId is undefined! Check if ChargeStation was created.");
                    }
                    const chargePoint = await ChargePoint.create({
                        ...testData.chargePoint,
                        stationId: dependentIds.stationId
                    });
                    dependentIds.chargePointId = chargePoint._id;
                }

                if (name === "Connector") {
                    if (!dependentIds.chargePointId) {
                        throw new Error("[ERROR] chargePointId is undefined! Check if ChargePoint was created.");
                    }
                    const connector = await Connector.create({
                        ...testData.connector,
                        chargePointId: dependentIds.chargePointId
                    });
                    createdId = connector._id;
                } else {
                    const item = await model.create({ ...data, ...dependentIds });
                    createdId = item._id;
                }
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
                else {
                    delete filteredDependentIds.locationId;
                }

                const res = await sendRequest(app, "post", endpoint, 201, { ...data, ...filteredDependentIds });

            });

            it(`should fetch all ${name.toLowerCase()}s`, async () => {
                await sendRequest(app, "get", endpoint, 200);
            });

            it(`should fetch a single ${name.toLowerCase()} by ID`, async () => {

                await sendRequest(app, "get", `${endpoint}/${createdId}`, 200);
            });

            it(`should update the ${name.toLowerCase()}`, async () => {
                const updatedData = { name: `${data.name} Updated` };
                await sendRequest(app, "put", `${endpoint}/${createdId}`, 200, updatedData);
            });

            it(`should delete the ${name.toLowerCase()}`, async () => {
                await sendRequest(app, "delete", `${endpoint}/${createdId}`, 200);
            });

            // 🔹 Fetch ChargeStations by Location ID
            if (name === "ChargeStation") {
                it("should fetch all charge stations for a given locationId", async () => {
                    await sendRequest(app, "get", `/chargestations-by-location/${dependentIds.locationId}`, 200);


                });
            }


            // 🔹 Fetch ChargePoints by Location ID & Station ID
            if (name === "ChargePoint") {
                it("should fetch all charge points for a given locationId", async () => {
                    await sendRequest(app, "get", `/chargepoints-by-location/${dependentIds.locationId}`, 200);
                });

                it("should fetch all charge points for a given stationId", async () => {
                    await sendRequest(app, "get", `/chargepoints-by-station/${dependentIds.stationId}`, 200);
                });
            }

            // 🔹 Fetch Connectors by Location ID, ChargePoint ID & Station ID
            if (name === "Connector") {
                it("should fetch all connectors for a given locationId", async () => {
                    await sendRequest(app, "get", `/chargepoints-by-location/${dependentIds.locationId}`, 200);
                });

                it("should fetch all connectors for a given chargePointId", async () => {
                    await sendRequest(app, "get", `/connectors-by-chargepoint/${dependentIds.chargePointId}`, 200);
                });

                it("should fetch all connectors for a given stationId", async () => {
                    await sendRequest(app, "get", `/connectors-by-chargestation/${dependentIds.stationId}`, 200);
                });
            }

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
describe("MongoDB Down Scenario", function () {
    this.timeout(15000);

    before(async function () {
        await mongoose.connection.close(); // Simulate MongoDB being down
    });

    it("should return an error when MongoDB is down", async function () {
        const res = await sendRequest(app, "get", "/location", 500);
    });

    after(async function () {
        await mongoose.connect("mongodb://localhost:27017/evChargingDB");
    });
});

