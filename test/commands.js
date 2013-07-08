// nodejs libs
var fs = require('fs');
var process = require('child_process');

// include the isaacs node-tap test harness
var test = require('tap').test;

//
// Create some constants for the tests to reuse
//
var DEFAULT_FIXTURE_CONFIG = 'mongoose-fixture-config.js';

//
// Self invoking function to do some cleanup / prep work for tests to run
//
var preTestCleanup = function(){
    // do some quick cleanup like deleting config
    // files generated from previous
    
    var local = fs.realpathSync('./');
    local += '/'+DEFAULT_FIXTURE_CONFIG;
    var targetExists = fs.existsSync(local);
    // unlink config if it exists
    if(targetExists){
        fs.unlinkSync(local);
    }

}();

// First Tests
test('Test Generate Config BoilerPlate', function(t){
    t.plan(3);
    
    // do file check
    var local = fs.realpathSync('./');
    local += DEFAULT_FIXTURE_CONFIG;

    var targetExists = fs.existsSync(local);
    
    // ensure false
    t.notOk(targetExists, 'a config file is not present');
    
    // run mongoose-fixture command to create config file
    process.exec('mongoose-fixture --generateConfig',function(err, stdout, stdin){
        t.notOk(err, 'No process errors for --generateConfig'); 
        // TODO standardize stdout from commands to we dont need to regex and can match
        var txtMatch = stdout.match(/Generating Fixture-Config/);
        //console.log('txt match ',txtMatch);
        t.ok(txtMatch, 'Success message received in generating config');
        t.end();
    
    });
});
