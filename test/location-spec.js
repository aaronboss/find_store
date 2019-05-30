const assert = require("assert");
const expect = require("expect.js");

var location = require("../src/location");
describe("location functionality", function() {
  it("get an address from geocode", function() {
    return location
      .getCurrentLocation("123 Main Street, New York, NY")
      .then(function(data) {
        // verify that data is returned
        expect(data).to.be.ok();

        // the lat and lng is accurate
        expect(data.results[0].geometry).to.eql({
          lat: 42.131738,
          lng: -73.8906118
        });
      });
  });
  it("get all csv data", function() {
    return location.getCSVData().then(function(data) {
      // verify that there is data returned
      expect(data).to.be.ok();

      // data is an array
      expect(data).to.be.an("array");

      // data length is greater than 0
      expect(data.length).to.be.above(0);
    });
  });
  it("get closest store, distance in miles, json output", async function() {
    const currentLocation = await location.getCurrentLocation(
      "123 Main Street, New York, NY"
    );
    const csvData = await location.getCSVData();
    return location
      .findClosestStore(currentLocation, csvData, "mi", "json")
      .then(function(data) {
        // verify json as a param results in an object as a result
        expect(data).to.be.an("object");

        // verify json data
        expect(data["Store Name"]).to.eql("Kingston");
        expect(data["Store Location"]).to.eql("SEC Rte 9W & Rte 209");
        expect(data.Address).to.eql("1300 Ulster Ave");
        expect(data.City).to.eql("Kingston");
        expect(data.State).to.eql("NY");
        expect(data["Zip Code"]).to.eql("12401-1501");
        expect(data.Latitude).to.eql("41.966857");
        expect(data.Longitude).to.eql("-73.984031");
        expect(data.County).to.eql("Ulster County");
        expect(data.distance).to.eql("12.36");
        expect(data.distanceUnits).to.eql("mi");
      });
  });
  it("get closest store, distance in kilometers, json output", async function() {
    const currentLocation = await location.getCurrentLocation(
      "123 Main Street, New York, NY"
    );
    const csvData = await location.getCSVData();
    return location
      .findClosestStore(currentLocation, csvData, "km", "json")
      .then(function(data) {
        // verify data is an object returned
        expect(data).to.be.an("object");

        // verify data object
        expect(data["Store Name"]).to.eql("Kingston");
        expect(data["Store Location"]).to.eql("SEC Rte 9W & Rte 209");
        expect(data.Address).to.eql("1300 Ulster Ave");
        expect(data.City).to.eql("Kingston");
        expect(data.State).to.eql("NY");
        expect(data["Zip Code"]).to.eql("12401-1501");
        expect(data.Latitude).to.eql("41.966857");
        expect(data.Longitude).to.eql("-73.984031");
        expect(data.County).to.eql("Ulster County");
        expect(data.distance).to.eql("19.89");
        expect(data.distanceUnits).to.eql("km");
      });
  });
  it("get closest store, distance in miles, text output", async function() {
    const currentLocation = await location.getCurrentLocation(
      "123 Main Street, New York, NY"
    );
    const csvData = await location.getCSVData();
    return location
      .findClosestStore(currentLocation, csvData, "mi", "text")
      .then(function(data) {
        // verify that if text is specified as a param,the output is a string
        expect(data).to.be.a("string");
        // verify that the address is the same and the distance is in miles
        expect(data).to.eql(
          "1300 Ulster Ave\nKingston, NY 12401-1501\nDistance: 12.36 mi"
        );
      });
  });
  it("get closest store, distance in kilometers, text output", async function() {
    const currentLocation = await location.getCurrentLocation(
      "123 Main Street, New York, NY"
    );
    const csvData = await location.getCSVData();
    return location
      .findClosestStore(currentLocation, csvData, "km", "text")
      .then(function(data) {
        // verify that if text is specified as a param, the output is a string
        expect(data).to.be.a("string");
        // verify that the address is the same and the distance is in kilometers
        expect(data).to.eql(
          "1300 Ulster Ave\nKingston, NY 12401-1501\nDistance: 19.89 km"
        );
      });
  });
});
