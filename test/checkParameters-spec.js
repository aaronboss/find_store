const expect = require("expect.js");

const parameters = require("../src/checkParameters");

describe("parameter functionality", function() {
  it("get an full data object from check parameters", function() {
    const data = parameters.checkRequiredParameters([
      "--address=233 S Wacker Dr, Chicago, IL 60606",
      "--units=km",
      "--output=json"
    ]);
    expect(data).to.be.ok();
    expect(data).to.be.an("object");

    // expect to get the address
    expect(data.address).to.be.ok();
    expect(data.address).to.eql("233 S Wacker Dr, Chicago, IL 60606");

    // expect to get the units
    expect(data.units).to.be.ok();
    expect(data.units).to.eql("km");

    // expect to get the output
    expect(data.output).to.be.ok();
    expect(data.output).to.eql("json");
  });
  it("get an full data object with defaults from check parameters", function() {
    const data = parameters.checkRequiredParameters([
      "--address=233 S Wacker Dr, Chicago, IL 60606"
    ]);
    expect(data).to.be.ok();
    expect(data).to.be.an("object");

    // expect to get the address
    expect(data.address).to.be.ok();
    expect(data.address).to.eql("233 S Wacker Dr, Chicago, IL 60606");

    // expect to get the units
    expect(data.units).to.be.ok();
    expect(data.units).to.eql("mi");

    // expect to get the output
    expect(data.output).to.be.ok();
    expect(data.output).to.eql("text");
  });
});
