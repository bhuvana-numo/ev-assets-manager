const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

const sendRequest = async (app, method, endpoint, expectedStatus, sendData = {}) => {
    const res = await request(app)[method](endpoint).send(sendData);
    expect(res.status).to.equal(expectedStatus);
    return res;
};

const validateResponse = (res, expectedData) => {
    if (Object.keys(expectedData).length > 0) {
        expect(res.body).to.deep.include(expectedData);
    }
};

module.exports = { sendRequest, validateResponse };
