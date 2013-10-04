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
console.log('//\n// Tests Starting \n//');
///////////////////////////
// CONSTANTS for testing 
///////////////////////////
// used to test the presence of the config
var FIXTURE_CONFIG_PRESENCE_FILE = 'mongoose-fixture-config.js';
// used as a mock fixture
var FIXTURE_CONFIG_MOCK_FILE = 'mongoose-fixture-config-mock.js';

// SCHEMA/FIXTURE Presence
var FIXTURE_PRESENCE = 'Products';
var FIXTURE_PRESENCE_FILE = FIXTURE_PRESENCE+'.js';
var SCHEMA_PRESENCE = 'ProductSchema';
var SCHEMA_PRESENCE_FILE = SCHEMA_PRESENCE+'.js';

// Fixture/Schema Presence Mock data
var FIXTURE_MOCK = 'ProductsMock.js';
var SCHEMA_MOCK = 'ProductSchemaMock.js';

// CLI Stubs
var CLI_MOCK = 'mongoose-fixture --configFile='+FIXTURE_CONFIG_MOCK_FILE+' ';  

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

// get our Mock Product schema loaded so we can reset 
// collection and do query later
var mongooseProductSchemaRef = require('./schemas/ProductSchemaMock')();
var mongooseProductModel =  mongoose.model('Product');

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
        console.log('collection dropped');
    });
    

}();  //<----- self-invoking on load


////////////////////////////////////////
// Test CLI File Generators
////////////////////////////////////////
test('Test Generate Config BoilerPlate', function(t){
    t.plan(4);
    
    // do file check
    var local = path.join(__dirname, FIXTURE_CONFIG_PRESENCE_FILE);

    var targetExists = fs.existsSync(local);
    // ensure false
    t.notOk(targetExists, 'confirm a config file is not present');
    
    // run mongoose-fixture command to create config file
    process.exec('mongoose-fixture --generateConfig',function(err, stdout, stdin){
        t.notOk(err, 'No process errors for --generateConfig'); 
        // TODO standardize stdout from commands to we dont need to regex and can match
        var txtMatch = stdout.match(/Generating Fixture-Config/);
        //console.log('txt match ',txtMatch);
        t.ok(txtMatch, 'Success message received in generating config');

        // do a file path check?
        targetExists = fs.existsSync(local);
        t.ok(targetExists, 'confirmed a config file was generated');

        t.end();
    
    });
});

// Ensures that a fixture file is generated when a command is issued
// Doesn't test anything about the contents of said fixture file
test('Test Generate Fixture BoilerPlate', function(t){
    // total tests
    t.plan(4);

    var local = path.join(__dirname, 'fixtures', FIXTURE_PRESENCE_FILE);
    var targetExists = fs.existsSync(local);
    t.notOk(targetExists, 'confirmed '+FIXTURE_PRESENCE_FILE+' is not present');
    
    // use the fixture-config-mock to actually generate a fixture file
    var cmd = "mongoose-fixture --configFile='"+FIXTURE_CONFIG_MOCK_FILE+"' --generateFixture='"+FIXTURE_PRESENCE+"'";
    
    process.exec(cmd,function(err, stdout, stdin){
        t.notOk(err, 'No process errors for --generateConfig'); 
        // TODO standardize stdout from commands to we dont need to regex and can match
        var txtMatch = stdout.match(/Generating DataFixture/);
        //console.log('txt match ',txtMatch);
        t.ok(txtMatch, 'Success message received in generating data fixture');

        // do a file path check?
        targetExists = fs.existsSync(local);
        t.ok(targetExists, 'confirmed a fixture file was generated');

        t.end();
    
    });


});

test('Test Generate Schema BoilerPlate', function(t){
    // total tests
    t.plan(4);

    var local = path.join(__dirname, 'schemas', SCHEMA_PRESENCE_FILE);
    var targetExists = fs.existsSync(local);
    t.notOk(targetExists, 'confirmed '+SCHEMA_PRESENCE_FILE+' is not present');
    
    // use the fixture-config-mock to actually generate a fixture file
    var cmd = "mongoose-fixture --configFile='"+FIXTURE_CONFIG_MOCK_FILE+"' --generateSchema='"+SCHEMA_PRESENCE+"'";
    
    process.exec(cmd,function(err, stdout, stdin){
        t.notOk(err, 'No process errors for --generateConfig'); 
        // TODO standardize stdout from commands to we dont need to regex and can match
        var txtMatch = stdout.match(/Generating Schema/);
        //console.log('txt match ',txtMatch);
        t.ok(txtMatch, 'Success message received in generating schema');

        // do a file path check?
        targetExists = fs.existsSync(local);
        t.ok(targetExists, 'confirmed a schema file was generated');

        t.end();
    
    });

});




///////////////////////////////
//  Test CLI Mock Data insertion
///////////////////////////////
test('Test that --fixture flag requires (add|reset|delete)', function(t){
    t.plan(1);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all"';
    process.exec(cmd, function(err, stdout, stdin){
        var txtMatch = stdout.match(/Required fixture action/);
        t.ok(txtMatch, 'Confirmed missing fixture action throws cli message');
        t.end();
    });
          
});

test('Test Products-Mock fixture data using --add for first time', function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all" --add';
    process.exec(cmd, function(err, stdout, stdin){

        // verify stdin message for fixtures loaded
        var txtMatch = stdout.match(/Fixtures loaded, closing db/);
        t.ok(txtMatch, 'Fixture loaded confirmed from stdin');
        
        mongooseProductModel.find({}, function(err, products){
            t.ok((products.length === 2), 'Checking Mongo collection contains '+products.length+' product(s)');
            t.end();
        });
        
    });
          
});

test('Test Products-Mock fixture data using --add for second time', function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all" --add';
    process.exec(cmd, function(err, stdout, stdin){

        // verify stdin message for fixtures loaded
        var txtMatch = stdout.match(/Fixtures loaded, closing db/);
        t.ok(txtMatch, 'Fixture loaded confirmed from stdin');
        
        mongooseProductModel.find({}, function(err, products){
            t.ok((products.length === 4), 'Checking Mongo collection contains '+products.length+' product(s)');
            t.end();
        });
        
    });
          
});

test('Test Products-Mock fixture data using --reset', function(t){
    t.plan(2);

    // use the fixture-config-mock to actually generate a fixture file
    var cmd = CLI_MOCK+' --fixture="all" --reset';
    process.exec(cmd, function(err, stdout, stdin){

        // verify stdin message for fixtures loaded
        var txtMatch = stdout.match(/Fixtures loaded, closing db/);
        t.ok(txtMatch, 'Fixture loaded confirmed from stdin');
        
        mongooseProductModel.find({}, function(err, products){
            t.ok((products.length === 2), 'Checking Mongo collection contains '+products.length+' product(s)');
            
            // disconnect mongoose
            mongoose.disconnect();
            t.end();


        });
        
    });
          
});
