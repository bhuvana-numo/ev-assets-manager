const { mongoose,expect } = require("./setup");
const Location = require("../models/Location");
let location;
const testApiResponse=require("./testapiresponse.js")


describe("Locations API", () => {

    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await Location.deleteMany({});
        location = new Location({ name: "Test Location", city: "Test City", country: "Test Country" });
        await location.save();
    });
    


    describe("GET /locations", () => {
        it("should GET all the locations", async () => {
            const res = await testApiResponse("location","GET", "/locations", {}, {
                name:location.name,
                city:location.city,
                country: location.country,
            }, 200);
            expect(res.body).to.be.an("array");
        });
    });

    describe("POST /locations", () => {
        it("should POST a new location", async () => {
            const newLocation = { name: "location-3", city: "hyderabad", country: "india" };
           const res= await testApiResponse("location","POST", "/locations", newLocation, newLocation, 201);
        });
        
    });

    describe("GET /locations/:id", () => {
        it("should GET a location by the given id", async () => {
            const res=await testApiResponse("location","GET", `/locations/${location._id}`, {},  {
                name:location.name,
                city:location.city,
                country: location.country,
            }, 200);
            expect(res.body).to.have.property("_id").that.equals(location._id.toString());
        });
    });

    describe("PUT /locations/:id", () => {
        it("should UPDATE a location given the id", async () => {
            const updatedData = { name: "location-5", city: "banglore", country: "india" };
            const res = await testApiResponse("location","PUT", `/locations/${location._id}`, updatedData, updatedData, 200);
            expect(res.body).to.have.property("_id").that.equals(location._id.toString());
        });
    });

    describe("DELETE /locations/:id", () => {
        it("should DELETE a location given the id", async () => {
            const res = await testApiResponse("location","DELETE", `/locations/${location._id}`, {}, null, 200);
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
