module.exports = {
    location: { 
        name: "Test Location", 
        city: "Test City", 
        country: "Test Country" 
    },
    chargeStation: { 
        name: "Station 1", 
        locationId: null  // Will be set dynamically in the test
    },
    chargePoint: { 
        stationId: null,  // Will be set dynamically in the test
        type: "Fast AC"  // Since `type` is required
    },
    connector: { 
        chargePointId: null,  // Will be set dynamically in the test
        power: 22 
    }
};

