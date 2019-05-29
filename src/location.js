const fs = require("fs");
const csv = require("csv-parser");

exports.getClosestStore = async function(address) {
  let closestStore = {};
  let closestValue;
  const results = [];

  const opencage = require("opencage-api-client");

  // testing data - less API Hits
  const location = {
    documentation: "https://opencagedata.com/api",
    licenses: [
      {
        name: "see attribution guide",
        url: "https://opencagedata.com/credits"
      }
    ],
    rate: { limit: 2500, remaining: 2498, reset: 1559088000 },
    results: [
      {
        annotations: {
          DMS: { lat: "35° 46' 32.88720'' N", lng: "78° 48' 21.18240'' W" },
          FIPS: { state: "37" },
          MGRS: "17SPV9832461302",
          Maidenhead: "FM05os36he",
          Mercator: { x: -8772630.878, y: 4244834.996 },
          OSM: {
            url:
              "https://www.openstreetmap.org/?mlat=35.77580&mlon=-78.80588#map=17/35.77580/-78.80588"
          },
          UN_M49: {
            regions: {
              AMERICAS: "019",
              NORTHERN_AMERICA: "021",
              US: "840",
              WORLD: "001"
            },
            statistical_groupings: ["MEDC"]
          },
          callingcode: 1,
          currency: {
            alternate_symbols: ["US$"],
            decimal_mark: ".",
            disambiguate_symbol: "US$",
            html_entity: "$",
            iso_code: "USD",
            iso_numeric: "840",
            name: "United States Dollar",
            smallest_denomination: 1,
            subunit: "Cent",
            subunit_to_unit: 100,
            symbol: "$",
            symbol_first: 1,
            thousands_separator: ","
          },
          flag: "🇺🇸",
          geohash: "dnrgw8z31ucgeu65xggk",
          qibla: 55.71,
          roadinfo: {
            drive_on: "right",
            road: "Old Apex Rd",
            speed_in: "mph"
          },
          sun: {
            rise: {
              apparent: 1559037660,
              astronomical: 1559031360,
              civil: 1559035920,
              nautical: 1559033700
            },
            set: {
              apparent: 1559002980,
              astronomical: 1559009280,
              civil: 1559004720,
              nautical: 1559006940
            }
          },
          timezone: {
            name: "America/New_York",
            now_in_dst: 1,
            offset_sec: -14400,
            offset_string: "-0400",
            short_name: "EDT"
          },
          what3words: { words: "opera.king.gone" }
        },
        components: {
          "ISO_3166-1_alpha-2": "US",
          "ISO_3166-1_alpha-3": "USA",
          _type: "road",
          continent: "North America",
          country: "United States of America",
          country_code: "us",
          road: "Old Apex Rd",
          state: "North Carolina",
          state_code: "NC",
          town: "Cary"
        },
        confidence: 6,
        formatted: "Old Apex Rd, Cary, NC, United States of America",
        geometry: { lat: 42.203244, lng: -88.374807 },
        oldgeometry: { lat: 35.775802, lng: -78.805884 }
      },
      {
        annotations: {
          DMS: { lat: "35° 43' 21.00000'' N", lng: "78° 50' 26.88000'' W" },
          FIPS: { county: "37183", state: "37" },
          MGRS: "17SPV9529755319",
          Maidenhead: "FM05nr93cj",
          Mercator: { x: -8776517.71, y: 4237556.22 },
          OSM: {
            url:
              "https://www.openstreetmap.org/?mlat=35.72250&mlon=-78.84080#map=17/35.72250/-78.84080"
          },
          UN_M49: {
            regions: {
              AMERICAS: "019",
              NORTHERN_AMERICA: "021",
              US: "840",
              WORLD: "001"
            },
            statistical_groupings: ["MEDC"]
          },
          callingcode: 1,
          currency: {
            alternate_symbols: ["US$"],
            decimal_mark: ".",
            disambiguate_symbol: "US$",
            html_entity: "$",
            iso_code: "USD",
            iso_numeric: "840",
            name: "United States Dollar",
            smallest_denomination: 1,
            subunit: "Cent",
            subunit_to_unit: 100,
            symbol: "$",
            symbol_first: 1,
            thousands_separator: ","
          },
          flag: "🇺🇸",
          geohash: "dnrgjzjfshwsgd73p16n",
          qibla: 55.7,
          roadinfo: { drive_on: "right", speed_in: "mph" },
          sun: {
            rise: {
              apparent: 1559037660,
              astronomical: 1559031360,
              civil: 1559035920,
              nautical: 1559033760
            },
            set: {
              apparent: 1559002980,
              astronomical: 1559009280,
              civil: 1559004720,
              nautical: 1559006880
            }
          },
          timezone: {
            name: "America/New_York",
            now_in_dst: 1,
            offset_sec: -14400,
            offset_string: "-0400",
            short_name: "EDT"
          },
          what3words: { words: "hike.skip.crib" }
        },
        bounds: {
          northeast: { lat: 35.865234, lng: -78.816424 },
          southwest: { lat: 35.717642, lng: -79.057515 }
        },
        components: {
          "ISO_3166-1_alpha-2": "US",
          "ISO_3166-1_alpha-3": "USA",
          _type: "county",
          continent: "North America",
          country: "United States of America",
          country_code: "us",
          county: "Wake County",
          postcode: "27523",
          state: "North Carolina",
          state_code: "NC"
        },
        confidence: 5,
        formatted: "Wake County, NC 27523, United States of America",
        geometry: { lat: 35.7225, lng: -78.8408 }
      }
    ],
    status: { code: 200, message: "OK" },
    stay_informed: {
      blog: "https://blog.opencagedata.com",
      twitter: "https://twitter.com/opencagedata"
    },
    thanks: "For using an OpenCage Data API",
    timestamp: {
      created_http: "Tue, 28 May 2019 23:25:00 GMT",
      created_unix: 1559085900
    },
    total_results: 2
  };

  // const location = await opencage.geocode({
  //   q: address
  // });

  // console.log("here is location", location);

  // if (location.results.length) {
  const data = await fs
    .createReadStream("../data/store-locations.csv")
    .pipe(csv())
    .on("data", data => results.push(data))
    .on("end", async () => {
      // results.map(result => console.log("zip code for ", result["Zip Code"]));
      // console.log(results);
      const lat = location.results[0].geometry.lat;
      const lng = location.results[0].geometry.lng;

      await Promise.all(
        results.map(result => {
          const differenceLat =
            result.Latitude > lat
              ? result.Latitude - lat
              : lat - result.Latitude;
          // console.log("differenceLat", result.Latitude, lat, differenceLat);
          const differenceLong =
            result.Longitude > lng
              ? result.Longitude - lng
              : lng - result.Longitude;
          const value = differenceLat + differenceLong;

          if (!closestValue || closestValue > value) {
            closestStore = result;
          }
          return result;
        })
      );
    });
  // }

  console.log("data", data);
  return closestStore;
};
