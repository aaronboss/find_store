const csv = require("csv-parser");
const fs = require("fs");
// const minimist = require("minimist");
const minimist = require("minimist");
const { checkRequiredParameters } = require("./checkParameters.js");
const results = [];
const args = minimist(process.argv.slice(2));

async function getClosestStore(address) {
  // Open Cage Data - Geocode apis : https://opencagedata.com/
  const opencage = require("opencage-api-client");

  const location = await opencage.geocode({
    q: args["address"] || args["zip"]
  });

  if (location.results.length) {
    fs.createReadStream("../data/store-locations.csv")
      .pipe(csv())
      .on("data", data => results.push(data))
      .on("end", () => {
        let closestStore = {};
        let closestValue;
        const lat = location.results[0].geometry.lat;
        const lng = location.results[0].geometry.lng;

        results.map(result => {
          const differenceLat =
            result.Latitude > lat
              ? result.Latitude - lat
              : lat - result.Latitude;
          const differenceLong =
            result.Longitude > lng
              ? result.Longitude - lng
              : lng - result.Longitude;
          const value = differenceLat + differenceLong;

          if (!closestValue || closestValue > value) {
            closestValue = value;
            closestStore = result;
          }
        });
        console.log("ClosestStore", closestStore);
      });
  } else {
    console.log("Location was not found");
  }
}

// main
const address = checkRequiredParameters(args);
if (address) {
  getClosestStore(address);
}
