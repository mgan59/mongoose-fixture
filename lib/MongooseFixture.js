/*
 *  MongooseFixture.js
 *
 *  Serves as the entrance into module interface
 *  Accepts a config, mongoose-connection
 *  Exposes the interface add, remove, and reset
 *  -- add --> adds the specified configListing documents
 *  -- remove --> removes all documents for a given collection
 *  -- reset --> first calls remove and then add, restoring the data-fixtures
 */

// load our libs we need
var async = require('async');
var baseFixtureLoader = require('./BaseFixtureLoader');
// pass in an array of obj-lits that contain all our fixture info
// along with a mongoose db-handler
module.exports = function(selectedFixtures, mongoose){
    var that = {};
    // the add method
    that.add = function(params, rootCallback){
        var autoDisconnect = true;
        if (params){
            autoDisconnect = ((params.autoDisconnect)? true:false);
        }
        // by default we use eachSeries in the event fixtures
        // are required to be loaded in specific order, could
        // add an 'each' flag for those that would prefer performance
        // over order
        async.eachSeries(selectedFixtures, 
            function(fixtureConfig, callback){
                // use our generic loader and load fixture
                baseFixtureLoader(fixtureConfig, mongoose, callback);
            }, 
            function(err){
                if(autoDisconnect){
                    // display interface commands 
                    console.log('Fixtures loaded, closing db');
                    mongoose.disconnect(function(err){
                        if(err){ 
                            console.log('WARNING: mongoose errord while disconnecting');
                        };
                        console.log('mongoose - disconnect');
                    }); //< end mongo-disconnect closure
                }else{
                    if(err){
                        rootCallback(err);
                    }
                    rootCallback(null, 'add');
                }
            }//< end seriesCallback
        ); //< end async
    };
    
    // @param are kwarg arguements like autoDisconnect
    // @param rootCallback is for async callbacks are used
    that.remove = function(params, rootCallback){
        var autoDisconnect = true;
        if (params){
            autoDisconnect = ((params.autoDisconnect)? true:false);
        }
        
        //use async wrapper to iterate deletions
        async.eachSeries(selectedFixtures, 
            function(item, callback){
                mongoose.connection.db.collection(item.collection, function(err, result){
                    if(err){
                        callback(err);
                    }
                    result.drop(function(err, result){
                        // improve log message to use the fixutre/colleciton name
                        console.log('collection ('+item.collection+') removed');
                        // propogate
                        callback(null);
                    });
                }); //< end mongoose-connect-collection accessors
            },
            // propogate final series calback
            function(err){
                // provide a way to backtrack out of callbacks with disconnecting mongo
                if(autoDisconnect){
                    // display interface commands 
                    console.log('Fixtures removed, closing db');
                    mongoose.disconnect(function(err){
                        if(err){ 
                            console.log('WARNING: mongoose errord while disconnecting');
                        };
                        console.log('mongoose - disconnect');
                    }); //< end mongo-disconnect closure
                }else{
                    if(err){
                        rootCallback(err);
                    }
                    console.log('Fixtures Removed');
                    rootCallback(null, 'remove');
                }
            }
        ); // end async

    };  //< end remove

    
    /*
     * The reset endpoint utilizes an additional callback layer used to process the
     * .remove endpoint and then calls .add otherwise they would run async with one-another
     *
     */
    that.reset = function(){
        // process one at a time
        async.series(
            //inline function-calls to handle reset
            [
                function(callback){
                    that.remove({autoDisconnect:false}, callback);
                }, 
                function(callback){
                    that.add({autoDisconnect:false}, callback);
                }
            ], 
            function(err, results){
                console.log('Reset of Fixtures Complete');
                mongoose.disconnect(function(err){
                    if(err){ 
                        console.log('WARNING: mongoose errord while disconnecting');
                    };
                    console.log('mongoose - disconnect');
                }); //< end mongo-disconnect closure

            }
        );
    };

    return that;
};
