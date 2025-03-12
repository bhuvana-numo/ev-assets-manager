const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

const sendRequest = async (app, method, endpoint, expectedStatus, sendData = {}) => {
    const res = await request(app)[method](endpoint).send(sendData);
    expect(res.status).to.equal(expectedStatus);
    return res;
};



module.exports = { sendRequest};
