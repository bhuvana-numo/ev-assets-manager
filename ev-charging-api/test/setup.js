process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

// Export commonly used modules
module.exports = {
    mongoose,
    request,
    expect,
    app,
};
