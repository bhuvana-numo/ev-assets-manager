const { mongoose,expect} = require("./setup");
const ChargeStation = require("../models/ChargeStation");
const  testApiResponse= require("./testapiresponse.js");
let res;
let location,chargeStation;


describe("ChargeStations API", () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        await ChargeStation.deleteMany({});

        const locationResponse = await testApiResponse("location",
            "POST",
            "/locations",
            { name: "Test Location", city: "test city", country: "test country" },
            { name: "Test Location", city: "test city", country: "test country" },
            201
        );

        location = locationResponse.body;


        chargeStation = new ChargeStation({
            name: "Test Station",
            locationId: location._id.toString()
        });

        await chargeStation.save();
    });




    describe("GET /chargeStations", () => {
        it("should GET all the locations", async () => {
            const res = await testApiResponse("chargeStation","GET", "/chargeStations", {},  {
                name: chargeStation.name,
                locationId: chargeStation.locationId.toString()
               
            }, 200);
            expect(res.body).to.be.an("array");
        });
    });

    describe("POST /chargeStations", () => {
        it("should POST a new charge station", async () => {
            const newchargeStation = {
                name: "New Test Station",
                locationId: location._id.toString() 
            };
            const res = await testApiResponse("chargeStation","POST", "/chargeStations", newchargeStation,newchargeStation, 201);
        });
    });
    

    describe("GET /chargeStations/:id", () => {
        it("should GET a charge station by ID", async () => {

            const res = await testApiResponse("chargeStation","GET", `/chargeStations/${chargeStation._id}`, {},  {
                name: chargeStation.name,
                locationId: chargeStation.locationId.toString()
               
            }, 200);
            expect(res.body).to.have.property("_id").that.equals(chargeStation._id.toString());
        });

    });

    describe("PUT /chargeStations/:id", () => {
        it("should UPDATE a charge station given the id", async () => {

            const updatedData = { name: "Updated Station",locationId:location._id};
            const res = await testApiResponse("chargeStation","PUT", `/chargeStations/${chargeStation._id}`, updatedData, updatedData, 200);
        });

    });

    describe("DELETE /chargeStations/:id", () => {
        it("should DELETE a charge station given the id", async () => {
            const res = await testApiResponse("chargeStation","DELETE", `/chargeStations/${chargeStation._id}`, {},null, 200);
            expect(res.body).to.have.property("message").that.equals("Charge Station deleted");
            const checkChargeStation = await ChargeStation.findById(chargeStation._id);
            expect(checkChargeStation).to.be.equal(null);
        });

    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});


