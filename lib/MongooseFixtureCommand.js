/*
 *  Preparing a cmd line interface to add/remove/reset
 *  mongoose fixtures using a config-file
 *
 *  By default configFile is set to mongoose-fixture-config
 *  and as a result the config checking will try to load it
 *  from the current-working directory.  All of this can be overriden
 *  passing in the configFile argument which can be an abs value
 *
 */
var argv = require('optimist')
    .usage('MongooseFixture is a command line interface to load fixture data into mongodb')
    .options('configFile',{
        alias:'c',
        default:'mongoose-fixture-config'
    })
    .options('fixture',{
        alias:'f',
        default:''
    })
    .boolean('add')
    .boolean('remove')
    .boolean('reset')
    .argv;


// don't waste anymore time if a fixture listing isn't set
if(argv.fixture === ''){
    console.log('Required --fixture,--f to be defined');
    process.exit();
}


// load out mongoose fixture module
var MongooseFixture = require('./MongooseFixture');

var run = function(){
// TODO:
// Research how to make file-system calls cross-platform for windows since
// '/' are not used and not sure ./ is required to include local files
var configFile = argv.configFile
// create out var stubb
var fixtureConfig = [];
// check if it is local pathing or abs
// check if abs path since it has '/' slash
if(configFile.substring(0,1) === '/'){
    // know the path so load file
    fixtureConfig = require(configFile);
} else {
    // need to determine if the path is a relative or direct lookup
    // if there are no '/' 
    if(configFile.search('/') === -1){
        // if is is local directory lookup need ./
        fixtureConfig = require('./'+configFile);
    } else {
        // try and load using the pathing
        fixtureConfig = require(configFile);
    }
}
console.log(configFile);

// check that the given fixtureListing key has a match
if(fixtureConfig.fixtureListings[argv.fixture] === undefined){
    console.log('Unable to locate '+argv.fixture+' inside of fixture-config');
    process.exit();
// and has fixutres to load
} else if(fixtureConfig.fixtureListings[argv.fixture].length == 0){
    console.log('Fixture '+argv.fixture+' found but is empty');
    process.exit();
}

// make sure we have an action, otherwise mongo connection will be made and no
// disconnect will happen causing the cmd line to hang
if(argv.add === false && argv.reset === false && argv.remove === false){
    console.log('Required fixure action (add/reset/remove) was specified');
    process.exit();
}

// include mongoose
var mongoose = require('mongoose');
// get database name from config :)
var mongoSettings = fixtureConfig.mongoConnection;
var mongoConnectionString = mongoSettings.host+':'+mongoSettings.port+'/'+mongoSettings.dbname; 
mongoose.connect('mongodb://'+mongoConnectionString);

// instantiate an instance of mongoose-fixture 
// to scope hoist mongoose and fixtureConfig listings
var mongooseFixture = MongooseFixture(fixtureConfig.fixtureListings[argv.fixture], mongoose);
    

// Handle fixture actions
if(argv.add){
    mongooseFixture.add(); 
}

if(argv.reset){
    mongooseFixture.reset();
}

if(argv.remove){
    // call removal
    mongooseFixture.remove();
}
}
module.exports = run;
