const { mongoose, request, expect, app } = require("./setup");
const Location = require("../models/Location");



describe("Locations API", () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await Location.deleteMany({});
    });

    describe("GET /locations", () => {
        it("should GET all the locations", async () => {
            const res = await request(app).get("/locations").expect(200);


            expect(res.body).to.be.an("array");
            expect(res.body.length).to.equal(0);
        });
    });

    describe("POST /locations", () => {
        it("should POST a new location", async () => {
            const location = { name: "location-3", city: "hyderabad", country: "india" };
            const res = await request(app).post("/locations").send(location).expect(201);


            expect(res.body).to.have.property("_id");
            expect(res.body).to.have.property("name").that.equals("Test Location");
            expect(res.body).to.have.property("city").that.equals("Test City");
            expect(res.body).to.have.property("country").that.equals("Test Country");
        });
    });

    describe("GET /locations/:id", () => {
        it("should GET a location by the given id", async () => {
            const location = new Location({
                name: "location-2",
                city: "delhi",
                country: "india"
                });
            await location.save();

            const res = await request(app).get(`/locations/${location._id}`).expect(200);

            


            expect(res.body).to.have.property("_id").that.equals(location._id.toString());
            expect(res.body).to.have.property("name").that.equals("location-2");
            expect(res.body).to.have.property("city").that.equals("delhi");
            expect(res.body).to.have.property("country").that.equals("india");
        });
    });

    describe("PUT /locations/:id", () => {
        it("should UPDATE a location given the id", async () => {
            const location = new Location({ name: "Old Location", city: "Old City", country: "Old Country" });
            await location.save();

            const updatedData = { name: "location-5", city: "banglore", country: "india" };
            const res = await request(app).put(`/locations/${location._id}`).send(updatedData).expect(200);


            expect(res.body).to.have.property("_id").that.equals(location._id.toString());
            expect(res.body).to.have.property("name").that.equals("location-5");
            expect(res.body).to.have.property("city").that.equals("Updated City");
            expect(res.body).to.have.property("country").that.equals("Updated Country");
        });
    });

    describe("DELETE /locations/:id", () => {
        it("should DELETE a location given the id", async () => {
            const location = new Location({ name: "To Be Deleted", city: "To Be Deleted City", country: "To Be Deleted Country" });
            await location.save();

            const res = await request(app).delete(`/locations/${location._id}`).expect(200);

            expect(res.body).to.have.property("message").that.equals("Location deleted");


            const checkLocation = await Location.findById(location._id);
            expect(checkLocation).to.be.equal(null);
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});