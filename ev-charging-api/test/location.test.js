const { mongoose, expect } = require("./setup");
const Location = require("../models/Location");
const testApiResponse = require("./testapiresponse.js");

let location;

describe("Locations API", () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await Location.deleteMany({});
        location = await Location.create({ name: "Test Location", city: "Test City", country: "Test Country" });
    });

    describe("GET /locations", () => {
        it("should GET all the locations", async () => {
            const res = await testApiResponse("location", "GET", "/locations", {}, {name: location.name,city: location.city,country: location.country,}, 200);
            expect(res.body).to.be.an("array");
        });
    });

    describe("POST /locations", () => {
        it("should POST a new location", async () => {
            const newLocation = { name: "location-3", city: "Hyderabad", country: "India" };
            await testApiResponse("location", "POST", "/locations", newLocation, newLocation, 201);
        });
    });

    describe("GET, PUT, DELETE /locations/:id", () => {
        const endpoint = () => `/locations/${location._id}`;

        it("should GET a location by the given id", async () => {
            const res = await testApiResponse("location", "GET", endpoint(), {}, {name: location.name,city: location.city,country: location.country,}, 200);
            expect(res.body).to.have.property("_id").that.equals(location._id.toString());
        });

        it("should UPDATE a location given the id", async () => {
            const updatedData = { name: "location-5", city: "Bangalore", country: "India" };
            const res = await testApiResponse("location", "PUT", endpoint(), updatedData, updatedData, 200);
            expect(res.body).to.have.property("_id").that.equals(location._id.toString());
        });

        it("should DELETE a location given the id", async () => {
            const res = await testApiResponse("location", "DELETE", endpoint(), {}, null, 200);
            expect(res.body).to.have.property("message").that.equals("Location deleted");
            const checkLocation = await Location.findById(location._id);
            expect(checkLocation).to.be.null;
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});
