const opencage = require("opencage-api-client");
const csv = require("csv-parser");
const fs = require("fs");
const geolib = require("geolib");

exports.getCurrentLocation = async function(address) {
  // Using Open Cage Data API
  return await opencage.geocode({
    q: address
  });
};

exports.getCSVData = async function() {
  return new Promise((resolve, reject) => {
    const results = [];

    // Read the whole file, save to an array, resolve promise with the array
    fs.createReadStream("../data/store-locations.csv")
      .pipe(csv())
      .on("data", data => results.push(data))
      .on('"error', err => reject(err))
      .on("end", () => resolve(results));
  });
};

exports.findClosestStore = async function(location, csvData, units, output) {
  return new Promise((resolve, reject) => {
    // if we have results and we have csv data, look up the location
    // Also check to make sure we have all the necessary parts of the location
    //   before continuing
    if (
      location.results.length &&
      csvData &&
      location.results[0].geometry &&
      location.results[0].geometry.lat &&
      location.results[0].geometry.lng
    ) {
      // set defaults
      let closestStore = {};
      let closestValue;

      const lat = location.results[0].geometry.lat;
      const lng = location.results[0].geometry.lng;

      // loop through csv data to find closest store via lat and lng
      csvData.map(result => {
        // flipping the numbers depending on which is greater to encompass all directions
        const differenceLat =
          result.Latitude > lat ? result.Latitude - lat : lat - result.Latitude;
        const differenceLong =
          result.Longitude > lng
            ? result.Longitude - lng
            : lng - result.Longitude;
        const value = differenceLat + differenceLong;

        // checking if latest value is closer than than the currently closest store.
        if (!closestValue || closestValue > value) {
          closestValue = value;
          closestStore = result;
        }
      });

      // determine the distance from the location to the closest store
      const meters = geolib.getDistance(
        {
          latitude: closestStore.Latitude,
          longitude: closestStore.Longitude
        },
        {
          latitude: lat,
          longitude: lng
        }
      );
      // since we get the distance back in meters, we need to convert the data based
      //   on what was specified as a param or as the default.
      // Add the distance to our json we are passing back.
      closestStore.distance = geolib.convertDistance(meters, units);
      closestStore.distanceUnits = units;
      if (output === "json") {
        // if json is the output, resolve the promise with the json.
        resolve(closestStore);
      } else {
        // if text is the output, format the string resolve the promise with the
        //   formatted string
        const outputString = `${closestStore.Address}\n${closestStore.City}, ${
          closestStore.State
        } ${closestStore["Zip Code"]}\nDistance: ${closestStore.distance} ${
          closestStore.distanceUnits
        }`;
        resolve(outputString);
      }
    } else {
      // If, for some reason we do not get a location, reject promise
      reject(new Error("No location found"));
    }
  });
};
