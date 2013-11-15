/*
 *  This test file contains the test specific to testing CLI interfaces
 *  including the generators and data insertion.
 *  Used node-tap for testing and basic assertions
 */

// nodejs libs
var fs = require('fs');
var process = require('child_process');
var path = require('path');
// include isaacs node-tap test harness
var test = require('tap').test;
var colors = require('colors');

colors.setTheme({
  testDefinition: 'cyan',
  testOutput: 'yellow',
  testSystem:'white',
  error: 'red'
});


///////////////////////////
// CONSTANTS for testing
///////////////////////////
// used to test the presence of the config
var FIXTURE_CONFIG_PRESENCE_FILE = 'mongoose-fixture-config.js';
// used as a mock fixture
var FIXTURE_CONFIG_MOCK_FILE = 'mongoose-fixture-config-mock.js';
var FIXTURE_MULTINODE_CONFIG_MOCK_FILE = 'mongoose-fixture-multinode-config-mock.js';
// SCHEMA/FIXTURE Presence
// These are the ones that get generated/deleted on each test run
var FIXTURE_PRESENCE = 'Products';
var FIXTURE_PRESENCE_FILE = FIXTURE_PRESENCE+'.js';
var SCHEMA_PRESENCE = 'ProductSchema';
var SCHEMA_PRESENCE_FILE = SCHEMA_PRESENCE+'.js';

// Fixture/Schema Mock data
var FIXTURE_MOCK = 'ProductsMock.js';
var BIG_FIXTURE_MOCK = 'ProductsBigMock.js';
var SCHEMA_MOCK = 'ProductSchemaMock.js';

// CLI Stubs
var CLI_MOCK = 'mongoose-fixture --configFile='+FIXTURE_CONFIG_MOCK_FILE+' ';
var CLI_MULTI_MOCK = 'mongoose-fixture --configFile='+FIXTURE_MULTINODE_CONFIG_MOCK_FILE+' ';


///////////////////////
// Connect to Mongo
///////////////////////
var mongoose = require('mongoose');
// get database name from config :)
var mongoSettings = {
    'host':'localhost',
    'port':27999,
    'dbname':'mongoose-fixture-test'
};

var mongoConnectionString = mongoSettings.host+':'+mongoSettings.port+'/'+mongoSettings.dbname;
mongoose.connect('mongodb://'+mongoConnectionString);

var mongoDisconnect = function(mongoose){
    console.log('Tests over so disconnect mongoose'.testSystem);
    mongoose.disconnect()
};

// get our Mock Product schema loaded so we can reset collection and do query later
// these are the schemas/fixtures we keep around :)
var mongooseProductSchemaRef = require('./schemas/ProductSchemaMock')(mongoose);
var mongooseProductModel = mongoose.model('Product', mongooseProductSchemaRef);


///////////////////////////
// File Generator Cleanup
///////////////////////////
var preTestCleanup = function(){
    /*
       Remove all the 'PRESENCE' based test files generated
       by the CL execution this way the generators can create
       new files
       */
    var presenceFiles = [
        path.join(__dirname, FIXTURE_CONFIG_PRESENCE_FILE),
        path.join(__dirname, 'fixtures', FIXTURE_PRESENCE_FILE),
        path.join(__dirname, 'schemas', SCHEMA_PRESENCE_FILE),
    ]
    for(var ctr=0; ctr < presenceFiles.length; ctr++){
        var targetExists = fs.existsSync(presenceFiles[ctr]);
        // unlink config if it exists
        if(targetExists){
            fs.unlinkSync(presenceFiles[ctr]);
        }
    }

    //console.log(mongoose.connection);
    // drop the mongoose-fixture-test collection 'products'
    mongoose.connection.collections['products'].drop( function(err) {
        console.log('|| Cleanup || \n[Collections dropped and presence files unlinked]'.white);
    });


}();  //<----- self-invoking on load


////////////////////////////////////////
// Test CLI File Generators
////////////////////////////////////////
test('Test Generate Config BoilerPlate'.testDefinition, function(t){
    t.plan(4);

    // do file check
    var local = path.join(__dirname, FIXTURE_CONFIG_PRESENCE_FILE);

    var targetExists = fs.existsSync(local);
    // ensure false
    t.notOk(targetExists, 'confirm a config file is not present'.testOutput);

    // run mongoose-fixture command to create config file
    process.exec('mongoose-fixture --generateConfig',function(err, stdout, stdin){
        t.notOk(err, 'No process errors for --generateConfig'.testOutput);
        // TODO standardize stdout from commands to we dont need to regex and can match
        var txtMatch = stdout.match(/Generating Fixture-Config/);
        //console.log('txt match ',txtMatch);
        t.ok(txtMatch, 'Success message received in generating config'.testOutput);

        // do a file path check?
        targetExists = fs.existsSync(local);
        t.ok(targetExists, 'confirmed a config file was generated'.testOutput);

        t.end();

    });
});

// Ensures that a fixture file is generated when a command is issued
// Doesn't test anything about the contents of said fixture file
test('Test Generate Fixture BoilerPlate'.testDefinition, function(t){
    // total tests
    t.plan(4);

    var local = path.join(__dirname, 'fixtures', FIXTURE_PRESENCE_FILE);
    var targetExists = fs.existsSync(local);
    var msg = 'confirmed '+FIXTURE_PRESENCE_FILE+' is not present';
    t.notOk(targetExists, msg.testOutput);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = "mongoose-fixture --configFile='"+FIXTURE_CONFIG_MOCK_FILE+"' --generateFixture='"+FIXTURE_PRESENCE+"'";

    process.exec(cmd,function(err, stdout, stdin){
        t.notOk(err, 'No process errors for --generateConfig'.testOutput);
        // TODO standardize stdout from commands to we dont need to regex and can match
        var txtMatch = stdout.match(/Generating DataFixture/);
        //console.log('txt match ',txtMatch);
        t.ok(txtMatch, 'Success message received in generating data fixture'.testOutput);

        // do a file path check?
        targetExists = fs.existsSync(local);
        t.ok(targetExists, 'confirmed a fixture file was generated'.testOutput);

        t.end();

    });


});

test('Test Generate Schema BoilerPlate'.testDefinition, function(t){
    // total tests
    t.plan(4);

    var local = path.join(__dirname, 'schemas', SCHEMA_PRESENCE_FILE);
    var targetExists = fs.existsSync(local);
    var msg = 'confirmed '+SCHEMA_PRESENCE_FILE+' is not present';
    t.notOk(targetExists, msg.testOutput);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = "mongoose-fixture --configFile='"+FIXTURE_CONFIG_MOCK_FILE+"' --generateSchema='"+SCHEMA_PRESENCE+"'";

    process.exec(cmd,function(err, stdout, stdin){
        t.notOk(err, 'No process errors for --generateConfig'.testOutput);
        // TODO standardize stdout from commands to we dont need to regex and can match
        var txtMatch = stdout.match(/Generating Schema/);
        //console.log('txt match ',txtMatch);
        t.ok(txtMatch, 'Success message received in generating schema'.testOutput);

        // do a file path check?
        targetExists = fs.existsSync(local);
        t.ok(targetExists, 'confirmed a schema file was generated'.testOutput);

        t.end();

    });

});




///////////////////////////////
//  Test CLI Mock Data insertion
///////////////////////////////
test('Test that --fixture flag requires (add|reset|delete)'.testDefinition, function(t){
    t.plan(1);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all"';
    process.exec(cmd, function(err, stdout, stdin){
        var txtMatch = stdout.match(/Required fixture action/);
        t.ok(txtMatch, 'Confirmed missing fixture action throws cli message'.testOutput);
        t.end();
    });

});

test('Test Products-Mock fixture data using --add for first time'.testDefinition, function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all" --add';
    process.exec(cmd, function(err, stdout, stdin){

        // verify stdin message for fixtures loaded
        var txtMatch = stdout.match(/Fixtures Loaded/);
        t.ok(txtMatch, 'Fixture loaded confirmed from stdout'.testOutput);

        //check that there are 2 items
        mongooseProductModel.find({}, function(err, products){
            var msg = 'Checking Mongo collection contains '+products.length+' product(s)'; 
            t.ok((products.length === 2), msg.testOutput);
            t.end();
        });

    });

});


test('Test Products-Mock fixture data using --add for second time'.testDefinition, function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all" --add';
    process.exec(cmd, function(err, stdout, stdin){

        // verify stdin message for fixtures loaded
        var txtMatch = stdout.match(/Fixtures Loaded/);
        t.ok(txtMatch, 'Fixture loaded confirmed from stdout'.testOutput);

        // check there are now 4 items
        mongooseProductModel.find({}, function(err, products){
            var msg = 'Checking Mongo collection contains '+products.length+' product(s)';
            t.ok((products.length === 4), msg.testOutput);
            t.end();
        });

    });

});

/*
 *  Make sure that if a user provides a busted collection name, that an error is thrown in removeal
 *  also makes sure that during a reset that the remove phase is doings its job
 */
test('Test BrokenRemove Products-Mock fixture data using --remove'.testDefinition, function(t){
    t.plan(1);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="brokenRemove" --remove';
    process.exec(cmd, function(err, stdout, stdin){
        // verify stdin message for broken fixture removal
        var txtMatch = stdout.match(/Error no collection [\w]+ exists/);
        t.ok(txtMatch, 'Broken Fixture removal confirmed error from stdout'.testOutput);

        // end test, till we determine how the rest of it should work
        t.end();

    });

});

//
// Must be followed by an add test, else could break tests down the line
//
test('Test Products-Mock fixture --remove'.testDefinition, function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all" --remove';
    process.exec(cmd, function(err, stdout, stdin){

        // verify stdin message for fixtures loaded
        var txtMatch = stdout.match(/Collection `[\w]+` removed/);
        t.ok(txtMatch, 'Fixture data removed and confirmed from stdout'.testOutput);

        // check there are now 4 items
        mongooseProductModel.find({}, function(err, products){
            var msg = 'Checking Mongo collection contains '+products.length+' product(s)';
            t.ok((products.length === 0), msg.testOutput);
            t.end();
        });

    });

});

test('Test Products-Object-Literal-Mock fixture --fixture=objlit --add'.testDefinition, function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="objlit" --add';
    process.exec(cmd, function(err, stdout, stdin){
        // verify stdout message for fixtures loaded
        var txtMatch = stdout.match(/Fixtures Loaded on \(localhost:27999\)/);
        t.ok(txtMatch, 'Fixture loaded confirmed from stdout'.testOutput);
        
        // check there are now 3 items
        mongooseProductModel.find({}, function(err, products){
            var msg = 'Checking Mongo collection contains '+products.length+' product(s)';
            t.ok((products.length === 3), msg.testOutput);
            t.end();
        });

    });

});
// do not breakup the follow two test, unless you understand why they are grouped ^^

/* commenting out test so I can make sure there is data in mongo, this will reset it all */
test('Test Products-Mock fixture data using --reset'.testDefinition, function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all" --reset';
    process.exec(cmd, function(err, stdout, stdin){

        // verify stdin message for fixtures loaded
        var txtMatch = stdout.match(/Fixtures Loaded/);
        t.ok(txtMatch, 'Fixture loaded confirmed from stdout'.testOutput);

        mongooseProductModel.find({}, function(err, products){
            var msg = 'Checking Mongo collection contains '+products.length+' product(s)';
            t.ok((products.length === 2), msg.testOutput);
            // last test so disconnect mongoose
            //mongoDisconnect(mongoose);
            t.end();
        });

    });

});

/*
 *  This is the test for the multi node instances, comment out if you don't want to run it every time
 */
/* */
test('Test Mulitnode Products-Mock fixture data using --add'.testDefinition, function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MULTI_MOCK+' --fixture="big" --add';
    process.exec(cmd, function(err, stdout, stdin){
        /*
        *  This test will work differently than the others since we need to check two mongo instaces
        *  for data and we don't have the proper scaffolding to drop the dbs and recreate
        *  so just check to ensure that 'Fixtures Loaded on (host:port) exists for the specified instances
        *
        */
        // verify stdin message for fixtures loaded
        var txtMatchOne = stdout.match(/Fixtures Loaded on \(localhost:27999\)/);
        var txtMatchTwo = stdout.match(/Fixtures Loaded on \(localhost:27998\)/);
        t.ok(txtMatchOne, 'Fixture loaded confirmed from stdout for localhost:27999'.testOutput);
        t.ok(txtMatchTwo, 'Fixture loaded confirmed from stdout for localhost:27998'.testOutput);


        // last test and we don't need mongoose to check anything so disconnect now
        mongoDisconnect(mongoose);
        t.end();

    });

});
/* */

