/*
 *  MongooseFixture.js
 *
 *  Serves as the entrance into module interface that bridges the CLI
 *  Accepts a config, mongoose-connection
 *  Exposes the interface add, remove, and reset
 *  -- add --> adds the specified configListing documents
 *  -- remove --> removes all documents for a given collection
 *  -- reset --> first calls remove and then add, restoring the data-fixtures
 */

// load our libs we need
var async = require('async');
var baseFixtureLoader = require('./BaseFixtureLoader');
var _ = require('lodash');
var colors = require('colors');
var fs = require('fs');
var path = require('path');
colors.setTheme({
  verbose: 'cyan',
  help: 'cyan',
  info: 'yellow',
  system:'white',
  mongoose: 'grey',
  error: 'red',
  complete:'green'
});
// pass in an array of obj-lits that contain all our fixture info
// along with a mongoose db-handler
module.exports = function(selectedFixtures, mongoose, conn){
    var that = {};
    that.hostString = conn.host+':'+conn.port;

    // IIF -> Immediate Invoking Function to init schemas/models
    that.initSchemas = function(){
        // make requires calls
        console.log('Mongoose-Fixture init schemas/models into conn'.info);

        var schemaPath = selectedFixtures[0].schemaPath;
        var schemaFiles = fs.readdirSync(schemaPath);
        schemaFiles.forEach(function (file) {
            if (path.extname(file).toLowerCase() === '.js') {
                //console.log('loading ',file);
                var schemaInfo = require(schemaPath + '/' + file)(mongoose, conn);
                // check if it exists already before jamming into models
                if(!_.has(conn.models, schemaInfo.name)){
                    conn.model(schemaInfo.name, schemaInfo.schema);
                }
            }
        });
    }();
    ////////// IIF

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
                baseFixtureLoader(fixtureConfig, mongoose, conn, callback);
            },
            function(err){
                if(autoDisconnect){
                    // display interface commands
                    console.log('Fixtures Loaded on ('+that.hostString+')');

                    conn.close(function(err){
                        if(err){
                            console.log('WARNING: mongoose errord while disconnecting');
                        };
                        var disconnectMessage = 'mongoose - disconnect ('+that.hostString+')';
                        console.log(disconnectMessage.mongoose);
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
        // for reporting, lets keep track of removals
        var _removalHistory = [];

        var autoDisconnect = true;
        if (params){
            autoDisconnect = ((params.autoDisconnect)? true:false);
        }

        //use async wrapper to iterate deletions
        async.eachSeries(selectedFixtures,
            function(item, callback){
               //console.log(item);
               // Prevent noisey log for removal checks for update-fixtures, so for listings without
               // schema or collection just skip trying to remove, which means if developer failed to
               // list his schema/collection in a listing he will get silent errors
               if(_.has(item, 'schema') && _.has(item, 'collection')){
                   //console.log(item.collection);
                   //console.log('----'.info);
                   // make a call to mongoose to get all the collection names
                   conn.db.collectionNames(function(err,names){
                        //console.log('collection lookup --> ',names);
                        // set our collectionExists flag to false, prove one exists
                        var collectionExists = false;
                        var name = '';
                        // iterate over collection namespace
                        _.each(names, function(collection){
                            name = _.values(collection)[0];
                            // each collection name is prefixed with dbname
                            // and separated by '.', note db.system.indexes is
                            // why we use lastIndexOf, this could fail if someone
                            // purposefully inserts '.' in their collection names
                            name = name.substr(name.lastIndexOf('.')+1);
                            if(name === item.collection){
                                collectionExists = true;
                            }
                        });

                        if(collectionExists){
                            conn.db.collection(item.collection, function(err, result){
                                if(err){
                                    callback(err);
                                }
                                result.drop(function(err, result){
                                    // improve log message to use the fixutre/colleciton name
                                    var msg = 'Collection `'+item.collection+'` removed';
                                    console.log(msg.yellow);

                                    // log the collection removal [to supress removal warnings for duplicates]
                                    _removalHistory.push(item.collection);

                                    // propogate
                                    callback(null);
                                });
                            }); //< end mongoose-connect-collection accessors

                        }else if (_.indexOf(_removalHistory, item.collection) === -1){
                            // problem here, if we have a missing collection this will block removal of others putting
                            // in a broken state or worse during reset it prevents the full removal and addition.
                            // Prefer we continue removal so at least we dont stop midway
                            // Also, issue when we have multiple fixtures usin same model, first removal dumps collection
                            // and subsequent calls to reset that fixture cause additional errors

                            //callback('Error no collection '+item.collection+' exists for removal.\n 1) Either there is no collection in mongoDB\n 2) Check your config listings to ensure you have pluralized your collections names to match');
                            console.log(('Collection '+item.collection+' was unavailable for removal').error);
                            callback(null);
                        } else {
                            console.log(('Collection '+item.collection+' was already removed').grey);
                            callback(null);
                        }
                    });
                } else {
                    callback(null);
                }
            },
            // propogate final series calback
            function(parentErr){
                // provide a way to backtrack out of callbacks with disconnecting mongo
                if(autoDisconnect){
                    if(parentErr){
                        // display interface commands
                        console.log(parentErr.error);
                    } else {
                        console.log('Fixtures removed, closing db('+that.hostString+')');
                    }

                    conn.close(function(err){
                        if(err){
                            console.log('WARNING: mongoose errord while disconnecting');
                        };
                        var disconnectMessage = 'mongoose - disconnect ('+that.hostString+')';
                        console.log(disconnectMessage.mongoose);
                    }); //< end mongo-disconnect closure

                }else{
                    if(parentErr){
                        return rootCallback(parentErr);
                    }
                    console.log('Fixtures Removed'.complete);
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
            function(parentErr, results){
                if(parentErr){
                    console.log(parentErr.error);
                } else {
                    console.log('Fixtures Loaded'.complete);
                    console.log('Reset of Fixtures Complete'.complete);
                }

                conn.close(function(err){
                    if(err){
                        console.log('WARNING: mongoose errord while disconnecting');
                    };
                    var disconnectMessage = 'mongoose - disconnect ('+that.hostString+')';
                    console.log(disconnectMessage.mongoose);
                }); //< end mongo-disconnect closure

            }
        );
    };

    return that;
};
