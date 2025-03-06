const request = require("supertest");
const { expect, app } = require("./setup");

let res;

const testApiResponse = async (type, method, endpoint, data = {}, expectedData = {}, statusCode = 200) => {
    const methods = {
        GET: (ep) => request(app).get(ep),
        POST: (ep, dt) => request(app).post(ep).send(dt),
        PUT: (ep, dt) => request(app).put(ep).send(dt),
        DELETE: (ep) => request(app).delete(ep)
    };

    if (!methods[method]) throw new Error(`Invalid method: ${method}`);

    res = await methods[method](endpoint, data).expect(statusCode);

    if (expectedData) {
        const responseBody = Array.isArray(res.body) ? res.body[0] : res.body;
        expect(responseBody).to.have.property("_id");
        validateResponse(type, responseBody, expectedData);
    }

    return res;
};

// Validation rules for different API responses
const validationRules = {
    location: (responseBody, expectedData) => {
        expect(responseBody).to.include({
            name: expectedData.name,
            city: expectedData.city,
            country: expectedData.country
        });
    },
    chargeStation: (responseBody, expectedData) => {
        expect(responseBody).to.have.property("name").that.equals(expectedData.name);
        expect(getId(responseBody.locationId)).to.equal(getId(expectedData.locationId));
    },
    chargePoint: (responseBody, expectedData) => {
        expect(getId(responseBody.stationId)).to.equal(getId(expectedData.stationId));
        expect(responseBody).to.have.property("type").that.equals(expectedData.type);
    },
    connector: (responseBody, expectedData) => {
        expect(getId(responseBody.chargePointId)).to.equal(getId(expectedData.chargePointId));
        expect(responseBody).to.have.property("power").that.equals(expectedData.power);
    }
};

// Universal ID extraction helper
const getId = (obj) => obj?._id?.toString() || obj?.toString() || "";

// Function to validate API response based on type
const validateResponse = (type, responseBody, expectedData) => {
    if (!validationRules[type]) throw new Error(`Validation not implemented for type: ${type}`);
    validationRules[type](responseBody, expectedData);
};

module.exports = testApiResponse;
