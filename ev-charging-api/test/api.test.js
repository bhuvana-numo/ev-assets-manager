const app = require("../server");
const mongoose = require("mongoose");
const { sendRequest, validateResponse } = require("./testApiResponse");
const testData = require("./testData");

describe("API Tests for All Collections", function () {
    this.timeout(10000);

    before(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    const apiTests = [
        { name: "Location", endpoint: "/api/locations", data: testData.location },
        { name: "ChargeStation", endpoint: "/api/chargestations", data: testData.chargeStation },
        { name: "ChargePoint", endpoint: "/api/chargepoints", data: testData.chargePoint },
        { name: "Connector", endpoint: "/api/connectors", data: testData.connector }
    ];

    apiTests.forEach(({ name, endpoint, data }) => {
        describe(`${name} API`, () => {
            let createdId;

            it(`should create a new ${name.toLowerCase()}`, async () => {
                const res = await sendRequest(app, "post", endpoint, 201, data);
                validateResponse(res, data);
                createdId = res.body._id; // Store created ID for later tests
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
                await sendRequest(app, "delete", `${endpoint}/${createdId}`,200);
            });

            it(`should return 404 for non-existing ${name.toLowerCase()}`, async () => {
                await sendRequest(app, "get", `${endpoint}/non_existing_id`, 404);
            });
        });
    });
});
