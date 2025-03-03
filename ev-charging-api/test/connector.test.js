process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const request = require("supertest");
const { expect } = require("chai").default;
const app = require("../server");
const Connector = require("../models/Connector");
const ChargePoint = require("../models/ChargePoint");

describe("Connectors API", () => {
    let chargePointId;

    before(async () => {
        await mongoose.connection.dropDatabase();

        // Create a valid ChargePoint with stationId
        const chargePoint = new ChargePoint({
            name: "Test ChargePoint",
            stationId: new mongoose.Types.ObjectId() // Required stationId
        });

        await chargePoint.save();
        chargePointId = chargePoint._id; // Store valid chargePointId
    });

    beforeEach(async () => {
        await Connector.deleteMany({});
    });

    describe("GET /connectors", () => {
        it("should return an empty array if no connectors exist", async () => {
            const res = await request(app).get("/connectors").expect(200);
            expect(res.body).to.have.length(0);

        });

        it("should return all connectors", async () => {
            const connector = new Connector({ chargePointId, power: 50 });
            await connector.save();

            const res = await request(app).get("/connectors").expect(200);
            expect(res.body).to.be.an("array").that.has.lengthOf(1);
            expect(res.body[0]).to.have.property("power").that.equals(50);
        });
    });

    describe("POST /connectors", () => {
        it("should create a new connector", async () => {
            const newConnector = { chargePointId, power: 100 };
            const res = await request(app).post("/connectors").send(newConnector).expect(201);

            expect(res.body).to.have.property("_id");
            expect(res.body).to.have.property("chargePointId").that.equals(chargePointId.toString());
            expect(res.body).to.have.property("power").that.equals(100);
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app).post("/connectors").send({}).expect(400);
            expect(res.body).to.have.property("error");
        });
    });

    describe("GET /connectors/:id", () => {
        it("should return 404 if connector ID does not exist", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/connectors/${fakeId}`).expect(404);
            expect(res.body).to.have.property("error").that.equals("Connector not found");
        });
    });

    describe("PUT /connectors/:id", () => {
        it("should return 400 for invalid data", async () => {
            const connector = new Connector({ chargePointId, power: 20 });
            await connector.save();

            const res = await request(app).put(`/connectors/${connector._id}`).send({ chargePointId: "12345" }).expect(400);
            expect(res.body).to.have.property("error").that.includes("must be a valid ObjectId");
        });

        it("should update a connector successfully", async () => {
            const connector = new Connector({ chargePointId, power: 50 });
            await connector.save();

            const updatedData = { power: 75 };
            const res = await request(app).put(`/connectors/${connector._id}`).send(updatedData).expect(200);
            expect(res.body).to.have.property("power").that.equals(75);
        });
    });

    describe("DELETE /connectors/:id", () => {
        it("should return 404 if connector does not exist", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/connectors/${fakeId}`).expect(404);
            expect(res.body).to.have.property("error").that.equals("Connector not found");
        });

        it("should delete a connector successfully", async () => {
            const connector = new Connector({ chargePointId, power: 30 });
            await connector.save();

            const res = await request(app).delete(`/connectors/${connector._id}`).expect(200);
            expect(res.body).to.have.property("message").that.equals("Connector deleted");

            // Ensure connector is deleted
            const deletedConnector = await Connector.findById(connector._id);
            expect(deletedConnector).to.be.equal(null);

        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
