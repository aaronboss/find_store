const Logger = require("js-logger");
const minimist = require("minimist");

exports.checkRequiredParameters = function(argv) {
  const args = minimist(argv);

  // check to see if there is at least one parameter after node and find_store
  const address = args["address"] || args["zip"];
  const units = args["units"] === "km" ? "km" : "mi";
  const output = args["output"] === "json" ? "json" : "text";

  // if Address doesn't appear in the params, show help
  if (!address) {
    Logger.info(`Find Store
      find_store will locate the nearest store (as the vrow flies) from
      store-locations.csv, print the matching store address, as well as
      the distance to that store.`);

    Logger.info(`\nUsage:
      find_store --address="<address>"
      find_store --address="<address>" [--units=(mi|km)] [--output=text|json]
      find_store --zip=<zip>
      find_store --zip=<zip> [--units=(mi|km)] [--output=text|json]`);

    Logger.info(`\nOptions:
      --zip=<zip>            Find nearest store to this zip code. If there are multiple best-matches, return the first.
      --address="<address>"  Find nearest store to this address. If there are multiple best-matches, return the first.
      --units=(mi|km)        Display units in miles or kilometers [default: mi]
      --output=(text|json)   Output in human-readable text, or in JSON (e.g. machine-readable) [default: text]`);

    Logger.info(`\nExample
      find_store --address="1770 Union St, San Francisco, CA 94123"
      find_store --zip=94115 --units=km`);
  }
  return { address, units, output };
};
