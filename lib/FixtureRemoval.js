var async = require('async');
// include mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27059/glaxal');


// so using the .db. name space we can access native-mongo driver
// we need to define the set of fixture keys we are deleting

fixtureDeletions = require('./fixture-config');

var FixtureRemoval = function(mongoose, fixtureConfig){
    
    //use async wrapper to iteratoe deletions
    async.eachSeries(fixtureDeletions, 
        function(item, callback){
            mongoose.connection.db.collection(item.collection, function(err, result){
                if(err){
                    callback(err);
                }
                result.drop(function(err, result){
                    // improve log message to use the fixutre/colleciton name
                    console.log('Collection ('+item.collection+') dropped');
                    // propogate
                    callback(null);
                });
            });
        }, 
        function(err){
            if(err){
                console.log('error and exception thrown');
            }
            console.log('---> ctrl+c to disconnect mongo');
        }
    );
});
