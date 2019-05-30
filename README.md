# find_store

Find store example

# Introduction

This is a javascript cli for the find_store project.

# Solution

I implemented a solution that will use Open Cage Data's (https://opencagedata.com/) geocoding API to look up an address
that is specified on the command line, as per specifications.

I also used javascript provided by GeoDataSource (https://www.geodatasource.com/developers/javascript) to implement a
latitude / longitude distance calculator.

The way this works is by taking the address from the command line and inserting that into the API. I take the results in confidence order,
pop off the first result, and run the location through all the store data. The store data, in CSV format, is then interated through, taking the
latitude and longitude. The latitude and longitude are then subtracted from the location's latitude and longitude, added together. The lowest value
I receive is the closest store. I reverse which latitude and longitude (the location's or the current store csv value) based on the bigger number.
This allows any store in any direction to process properly.

# Execution

Since this is javascript, I used Node to execute the javascript. I saved the code in the src directory.

`node find_store --address="123 Main Street, Chicago, IL 60001"`

# Testing

I chose to test in mocha. I wrote test to verify the functionality of each piece. I saved the tests in the test directory

`mocha *-spec.js`

# NOTE

An API key from Open Cage is required. Adding information to the src/.env file will allow this to work.

.env (/src directory)

`OCD_API_KEY=<key>`
