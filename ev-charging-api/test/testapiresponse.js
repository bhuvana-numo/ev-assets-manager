const request = require("supertest");
const { expect, app } = require("./setup");

let res;

const testApiResponse = async (type, method, endpoint, data = {}, expectedData = {}, statusCode = 200) => {
    if (method === "GET") {
        res = await request(app).get(endpoint).expect(statusCode);
    } else if (method === "POST") {
        res = await request(app).post(endpoint).send(data).expect(statusCode);
    } else if (method === "PUT") {
        res = await request(app).put(endpoint).send(data).expect(statusCode);
    } else if (method === "DELETE") {
        res = await request(app).delete(endpoint).expect(statusCode);
    }

    if (expectedData) {
        if (Array.isArray(res.body)) {
            expect(res.body).to.be.an("array").that.is.not.empty;
            validateResponse(type, res.body[0], expectedData);
        } else {
            validateResponse(type, res.body, expectedData);
        }
    }

    return res;
};

// Function to validate different API responses
const validateResponse = (type, responseBody, expectedData) => {

    expect(responseBody).to.have.property("_id");

    if (type === "location") {
        expect(responseBody).to.have.property("name").that.equals(expectedData.name);
        expect(responseBody).to.have.property("city").that.equals(expectedData.city);
        expect(responseBody).to.have.property("country").that.equals(expectedData.country);
    } else if (type === "chargeStation") {
        expect(responseBody).to.have.property("name").that.equals(expectedData.name);

        const actualLocationId = responseBody.locationId?._id
            ? responseBody.locationId._id.toString()
            : responseBody.locationId?.toString();

        expect(actualLocationId).to.equal(expectedData.locationId.toString());
    } else if (type === "chargePoint") {
        if (responseBody.stationId) {
            const actualStationId = responseBody.stationId._id
                ? responseBody.stationId._id.toString()
                : responseBody.stationId.toString();

            expect(actualStationId).to.equal(expectedData.stationId.toString());
        } else {
            throw new Error("stationId is missing in the response");
        }
        expect(responseBody).to.have.property("type").that.equals(expectedData.type);
    } else if (type === "connector") {
        if (responseBody.chargePointId) {
            const actualChargePointId = responseBody.chargePointId._id
                ? responseBody.chargePointId._id.toString()
                : responseBody.chargePointId.toString();

            expect(actualChargePointId).to.equal(expectedData.chargePointId.toString());
        } else {
            throw new Error("chargePointId is missing in the response");
        }
        expect(responseBody).to.have.property("power").that.equals(expectedData.power);
    }
};


module.exports = testApiResponse;
