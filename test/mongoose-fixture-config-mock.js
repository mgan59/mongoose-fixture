/*
 *  mongoose-fixture-config.js.js
 *  Generated by mongoose-fixture (v0.2.0)
 *
 *  Generic configuration
 *  Please customize your mongodb, pathing, and FixtureListing
 *
 */

// Load the default object that helps manage a FixtureConfig
// NOTE: hot link to local directory
var FixtureConfig = require('../lib').FixtureConfig;

// Create our fixture config with defined
// mongo-connection and file paths
var fixtureConfig = FixtureConfig({
    /* */
    mongoConnection:{
        'host':'localhost',
        'port':'27999',
        'dbname':'mongoose-fixture-test'
    }
    /* */
    /*  Multi Node connection/writing test harness
    , mongoConnection:{
        servers:[
            {
                'host':'localhost',
                'port':'27999'
            },
            {
                'host':'localhost',
                'port':'27020'
            }
        ],
        'dbname':'mongoose-fixture-test'
    }
    /* */
    , paths:{
        schemaPath:__dirname+'/schemas/',
        dataFixturePath:__dirname+'/fixtures/'
    }
});


// Create a Listing of fixtures
var allFixtures = [
    // just an example of a fixture listing
    {
        // general name used in output log
        schema:'Product',
        // name of the schema file (without the .js)
        data:'ProductsMock',
        // collection name in for removal process
        collection:'products'
    },
    {
        // general name used in output log
        schema:'Product',
        // name of the data-fixture file (without the .js)
        data:'ProductsObjectLiteralMock',
        // collection name in for removal process
        collection:'products'
    }
];

// Create a Listing of fixtures
var bigFixtures = [
    // just an example of a fixture listing
    {
        // general name used in output log
        schema:'Product',
        // name of the data-fixture file (without the .js)
        data:'ProductsBigMock',
        // collection name in for removal process
        collection:'products'
    }
];

// Create a listing of fixtures
var objLitFixtures = [
    // just an example of a fixture listing
    {
        // general name used in output log
        schema:'Product',
        // name of the data-fixture file (without the .js)
        data:'ProductsObjectLiteralMock',
        // collection name in for removal process
        collection:'products'
    }
];

// Create a Listing of fixtures
var brokenRemoveFixtures = [
    // just an example of a fixture listing
    {
        // general name used in output log
        schema:'Product',
        // name of the data-fixture file (without the .js)
        data:'ProductsMock',
        // collection name in for removal process
        collection:'prdocuto'
    },
];

var updateFixtures = [
    // just an example of a fixture listing
    {
        // general name used in output log
        schema:'Product',
        // name of the data-fixture file (without the .js)
        data:'ProductsUpdateMock',
        // collection name in for removal process
        collection:'products'
    }
];




// load fixture listings
fixtureConfig.fixtureListings.set('all', allFixtures);
fixtureConfig.fixtureListings.set('big', bigFixtures);
fixtureConfig.fixtureListings.set('objlit', objLitFixtures);
fixtureConfig.fixtureListings.set('brokenRemove', brokenRemoveFixtures);
fixtureConfig.fixtureListings.set('update', updateFixtures);

// export the config
module.exports = fixtureConfig;

