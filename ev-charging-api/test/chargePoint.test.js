const { mongoose, expect, app } = require("./setup");
const ChargePoint = require("../models/ChargePoint");
const ChargeStation = require("../models/ChargeStation");
const Location = require("../models/Location");
const testApiResponse = require("./testapiresponse.js");

describe("ChargePoints API", () => {
    let chargeStation, location, chargePoint;

    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await ChargePoint.deleteMany({});
        await ChargeStation.deleteMany({});
        await Location.deleteMany({});

        // Create Location
        location = new Location({ name: "Test Location", city: "Test City", country: "Test Country" });
        await location.save();

        // Create ChargeStation
        chargeStation = new ChargeStation({ name: "Test Station", locationId: location._id });
        await chargeStation.save();

        // Create ChargePoint
        chargePoint = new ChargePoint({ stationId: chargeStation._id, type: "Fast Charger" });
        await chargePoint.save();
    });

    describe("GET /chargePoints", () => {
        it("should GET all charge points", async () => {
            const res = await testApiResponse("chargePoint", "GET", "/chargePoints", {}, {
                stationId: chargePoint.stationId.toString(),
                type: chargePoint.type,
            }, 200);
            expect(res.body).to.be.an("array");
            expect(res.body.length).to.equal(1);
        });
    });

    describe("POST /chargePoints", () => {
        it("should POST a new charge point", async () => {
            const newChargePoint = { stationId: chargeStation._id, type: "Ultra Fast Charger" };

            const res = await testApiResponse("chargePoint", "POST", "/chargePoints", newChargePoint, newChargePoint, 201);

            expect(res.body).to.have.property("_id");
        });
    });

    describe("GET /chargePoints/:id", () => {
        it("should GET a charge point by ID", async () => {
            const res = await testApiResponse("chargePoint", "GET", `/chargePoints/${chargePoint._id}`, {}, {
                stationId: chargePoint.stationId.toString(),
                type: chargePoint.type,
            }, 200);
        });
    });

    describe("PUT /chargePoints/:id", () => {
        it("should UPDATE a charge point given the id", async () => {
            const updatedData = {
                stationId: chargePoint.stationId.toString(),
                type: "Updated Charger"
            };

            const res = await testApiResponse("chargePoint", "PUT", `/chargePoints/${chargePoint._id}`, updatedData, updatedData, 200);
        });
    });

    describe("DELETE /chargePoints/:id", () => {
        it("should DELETE a charge point given the id", async () => {
            const res = await testApiResponse("chargePoint", "DELETE", `/chargePoints/${chargePoint._id}`, {}, null, 200);

            expect(res.body).to.have.property("message").that.equals("Charge Point deleted");

            const checkChargePoint = await ChargePoint.findById(chargePoint._id);
            expect(checkChargePoint).to.be.null;
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
