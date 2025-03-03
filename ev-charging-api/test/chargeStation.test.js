process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const request = require("supertest");
const { expect } = require("chai").default;
const ChargeStation = require("../models/ChargeStation");
const app = require("../server");

describe("ChargeStations API", () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await ChargeStation.deleteMany({});
    });

    describe("GET /chargeStations", () => {
        it("should GET all the charge stations", async () => {
            const res = await request(app).get("/chargeStations").expect(200);
            expect(res.body).to.be.an("array");
            expect(res.body.length).to.equal(0);
        });
    });

    describe("POST /chargeStations", () => {
        it("should POST a new charge station", async () => {
            const chargeStation = { name: "Test Station" };
            const res = await request(app).post("/chargeStations").send(chargeStation).expect(201);
            
            expect(res.body).to.have.property("_id");
            expect(res.body).to.have.property("name").that.equals("Test Station");
        });

        it("should return 400 for missing name field", async () => {
            const res = await request(app).post("/chargeStations").send({}).expect(400);
            expect(res.body).to.have.property("error").that.includes("`name` is required");
        });
    });

    describe("GET /chargeStations/:id", () => {
        it("should GET a charge station by ID", async () => {
            const chargeStation = new ChargeStation({ name: "Test Station" });
            await chargeStation.save();

            const res = await request(app).get(`/chargeStations/${chargeStation._id}`).expect(200);
            expect(res.body).to.have.property("_id").that.equals(chargeStation._id.toString());
            expect(res.body).to.have.property("name").that.equals("Test Station");
        });

        it("should return 404 for a non-existent charge station", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/chargeStations/${nonExistentId}`).expect(404);
            expect(res.body).to.have.property("error").that.includes("Charge Station not found");
        });
    });

    describe("PUT /chargeStations/:id", () => {
        it("should UPDATE a charge station given the id", async () => {
            const chargeStation = new ChargeStation({ name: "Old Station" });
            await chargeStation.save();

            const updatedData = { name: "Updated Station" };
            const res = await request(app).put(`/chargeStations/${chargeStation._id}`).send(updatedData).expect(200);

            expect(res.body).to.have.property("_id").that.equals(chargeStation._id.toString());
            expect(res.body).to.have.property("name").that.equals("Updated Station");
        });

        it("should return 400 for invalid update fields", async () => {
            const chargeStation = new ChargeStation({ name: "Test Station" });
            await chargeStation.save();

            const res = await request(app).put(`/chargeStations/${chargeStation._id}`).send({ invalidField: "test" }).expect(400);
            expect(res.body).to.have.property("error").that.includes("Invalid field");
        });
    });

    describe("DELETE /chargeStations/:id", () => {
        it("should DELETE a charge station given the id", async () => {
            const chargeStation = new ChargeStation({ name: "To Be Deleted" });
            await chargeStation.save();

            const res = await request(app).delete(`/chargeStations/${chargeStation._id}`).expect(200);
            expect(res.body).to.have.property("message").that.equals("Charge Station deleted");

            const checkChargeStation = await ChargeStation.findById(chargeStation._id);
            expect(checkChargeStation).to.be.equal(null);
        });

        it("should return 404 for deleting a non-existent charge station", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/chargeStations/${nonExistentId}`).expect(404);
            expect(res.body).to.have.property("error").that.includes("Charge Station not found");
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
