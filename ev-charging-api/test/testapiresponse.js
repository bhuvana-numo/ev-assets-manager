const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

const sendRequest = async (app, method, endpoint, expectedStatus, sendData = {}) => {
    const res = await request(app)[method](endpoint).send(sendData);
    expect(res.status).to.equal(expectedStatus);
    return res;
};

const mongoose = require("mongoose");

const normalizeObject = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = mongoose.Types.ObjectId.isValid(obj[key]) ? obj[key].toString() : obj[key];
        return acc;
    }, {});
};

const validateResponse = (res, expectedData) => {
    const expectedNormalized = normalizeObject(expectedData);
    const responseNormalized = normalizeObject(res.body);
    expect(responseNormalized).to.deep.include(expectedNormalized);
};


module.exports = { sendRequest, validateResponse };
