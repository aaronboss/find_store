const Logger = require("js-logger");

const { checkRequiredParameters } = require("./checkParameters");
const {
  getCurrentLocation,
  getCSVData,
  findClosestStore
} = require("./location");
const results = [];
Logger.useDefaults();

(async function() {
  const { address, units, output } = checkRequiredParameters(process.argv);
  try {
    // if the address isn't present, do not continue with processing
    if (address) {
      // get the location specified through geocode ()
      const location = await getCurrentLocation(address);

      // get the csv data
      const csvData = await getCSVData();

      // go find the closest store
      const closestStore = await findClosestStore(
        location,
        csvData,
        units,
        output
      );

      // display store information
      Logger.info(closestStore);
      return closestStore;
    }
  } catch (err) {
    Logger.error(err);
  }
})();
