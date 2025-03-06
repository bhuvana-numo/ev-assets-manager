const { mongoose, expect } = require("./setup");
const ChargeStation = require("../models/ChargeStation");
const testApiResponse = require("./testapiresponse.js");

let location, chargeStation;

describe("ChargeStations API", () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await ChargeStation.deleteMany({});

        const locationData = { name: "Test Location", city: "test city", country: "test country" };
        const locationResponse = await testApiResponse("location", "POST", "/locations", locationData, locationData, 201);

        location = locationResponse.body;

        chargeStation = await ChargeStation.create({
            name: "Test Station",
            locationId: location._id.toString()
        });
    });

    describe("GET /chargeStations", () => {
        it("should GET all charge stations", async () => {
            const res = await testApiResponse("chargeStation", "GET", "/chargeStations", {}, {name: chargeStation.name,locationId: chargeStation.locationId.toString()}, 200);
            expect(res.body).to.be.an("array");
        });
    });

    describe("POST, GET, PUT, DELETE /chargeStations/:id", () => {
        const endpoint = () => `/chargeStations/${chargeStation._id}`;

        it("should POST a new charge station", async () => {
            const newChargeStation = { name: "New Test Station", locationId: location._id.toString() };
            await testApiResponse("chargeStation", "POST", "/chargeStations", newChargeStation, newChargeStation, 201);
        });

        it("should GET a charge station by ID", async () => {
            const res = await testApiResponse("chargeStation", "GET", endpoint(), {}, {name: chargeStation.name,locationId: chargeStation.locationId.toString()}, 200);
            expect(res.body).to.have.property("_id").that.equals(chargeStation._id.toString());
        });

        it("should UPDATE a charge station given the id", async () => {
            const updatedData = { name: "Updated Station", locationId: location._id.toString() };
            await testApiResponse("chargeStation", "PUT", endpoint(), updatedData, updatedData, 200);
        });

        it("should DELETE a charge station given the id", async () => {
            const res = await testApiResponse("chargeStation", "DELETE", endpoint(), {}, null, 200);
            expect(res.body).to.have.property("message").that.equals("Charge Station deleted");

            const checkChargeStation = await ChargeStation.findById(chargeStation._id);
            expect(checkChargeStation).to.be.null;
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
