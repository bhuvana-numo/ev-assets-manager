process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const request = require("supertest");
const { expect } = require("chai");
const ChargePoint = require("../models/ChargePoint");
const ChargeStation = require("../models/ChargeStation");
const app = require("../server");

describe("ChargePoints API", () => {
    let chargeStation;

    before(async () => {
        await mongoose.connection.dropDatabase();
        chargeStation = new ChargeStation({ name: "Test Station" });
        await chargeStation.save();
    });

    beforeEach(async () => {
        await ChargePoint.deleteMany({});
    });

    describe("GET /chargePoints", () => {
        it("should GET all charge points", async () => {
            const res = await request(app).get("/chargePoints").expect(200);
            expect(res.body).to.be.an("array");
            expect(res.body.length).to.equal(0);
        });
    });

    describe("POST /chargePoints", () => {
        it("should POST a new charge point", async () => {
            const chargePoint = { stationId: chargeStation._id, type: "Fast Charger" };
            const res = await request(app).post("/chargePoints").send(chargePoint).expect(201);

            expect(res.body).to.have.property("_id");
            expect(res.body).to.have.property("stationId").that.equals(chargeStation._id.toString());
            expect(res.body).to.have.property("type").that.equals("Fast Charger");
        });

        it("should return 400 for missing stationId field", async () => {
            const res = await request(app).post("/chargePoints").send({ type: "Slow Charger" }).expect(400);
            expect(res.body).to.have.property("error").that.includes("`stationId` is required");
        });
    });

    describe("GET /chargePoints/:id", () => {
        it("should GET a charge point by ID", async () => {
            const chargePoint = new ChargePoint({ stationId: chargeStation._id, type: "Test Type" });
            await chargePoint.save();

            const res = await request(app).get(`/chargePoints/${chargePoint._id}`).expect(200);
            expect(res.body).to.have.property("_id").that.equals(chargePoint._id.toString());
            expect(res.body).to.have.property("type").that.equals("Test Type");
        });
    });

    describe("PUT /chargePoints/:id", () => {
        it("should UPDATE a charge point given the id", async () => {
            const chargePoint = new ChargePoint({ stationId: chargeStation._id, type: "Old Type" });
            await chargePoint.save();

            const updatedData = { type: "Updated Type" };
            const res = await request(app).put(`/chargePoints/${chargePoint._id}`).send(updatedData).expect(200);

            expect(res.body).to.have.property("_id").that.equals(chargePoint._id.toString());
            expect(res.body).to.have.property("type").that.equals("Updated Type");
        });
    });

    describe("DELETE /chargePoints/:id", () => {
        it("should DELETE a charge point given the id", async () => {
            const chargePoint = new ChargePoint({ stationId: chargeStation._id, type: "To Be Deleted" });
            await chargePoint.save();

            const res = await request(app).delete(`/chargePoints/${chargePoint._id}`).expect(200);
            expect(res.body).to.have.property("message").that.equals("Charge Point deleted");

            const checkChargePoint = await ChargePoint.findById(chargePoint._id);
            expect(checkChargePoint).to.be.equal(null);

        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
