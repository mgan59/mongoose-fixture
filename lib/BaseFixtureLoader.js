/*
 *  BaseFixtureLoader.js
 *
 *  Our base loader class that handles the abstraction for inserting/updating the fixtures
 *  @ fixtureConfig
 *  @ mongoose
 *  @ callback, to root level async-control-flow
 *
 */

var async = require('async');
var _ = require('lodash');
var colors = require('colors');

colors.setTheme({
  verbose: 'cyan',
  help: 'cyan',
  info: 'yellow',
  system:'white',
  debug: 'grey',
  error: 'red'
});

// rootCallback came from the mongoose-fixture top level async.seriesEach
// it must be executed on the loaders async completion to propogate back up the chain
module.exports = function(fixtureConfig, mongoose, conn, rootCallback){
    //console.log('fired ', fixtureConfig);
    //unpack fixtureConfig
    var fixtureSchemaKey = ((fixtureConfig.schema)? capitalizeFirstLetter(fixtureConfig.schema):'');
    var fixtureDataKey = fixtureConfig.data;

    // data-fixtures now accept a callback that must be returned
    // this callback allows one to add internal/additional async branches
    // within a fixture, specifically to load embeddable documents
    // hooks are available for a plugin system or future features
    var fixtureData = require(fixtureConfig.dataFixturePath+fixtureDataKey)(mongoose, conn, function(err, globalFixtureData, operation){
        var operation = ((!_.isString(operation))? 'insert':operation);

        // our kludge/namespace for the fixtureSet we plan to insert
        var fixtureSet = null;
        // globalFixtureData the data container passed back by a fixture's callback
        // and can be of many shapes either it is an object-literal [PlainObject] or
        // and array of data.
        if(_.isPlainObject(globalFixtureData)){
            // if it is a plainobject check to see if it has a key/namespace `dataFixture`
            // if so point fixtureSet to it
            // Consider deprecating this in the future and just allowing the interface of
            // an object literal or the array
            // believe this was left open as a hook system for plugins?
            if(globalFixtureData.dataFixtures){
                fixtureSet = globalFixtureData.dataFixtures;
            } else {
            // otherwise if the fixture data was hung on an obj-lits keys
            // reduce the keys down to a flattened array of object-lits
                globalFixtureData = _.values(globalFixtureData);
            }
        }

        // if we were passed an array of fixture data or created one from _.values
        // kludge it into our fixtureSet
        if(_.isArray(globalFixtureData)){
            fixtureSet = globalFixtureData;
        }

        /*
         *  Insert - using the `create` method on the static-model class create new documents
         *  Update - expects the fixtureSet handed off to be a list of mongoose-db-doc-objs that
         *  has access to a `save` method that saves the orm manually
         *
         *  Functions are pretty much duplicates except for how fixtureModel.create and dataDoc.save
         *  are called and the final output message of `loaded` versus `updated`
         *
         */

        //
        // Operation: Insert
        // **default**
        //
        if(operation === 'insert'){
            // Fetch our registered Schema as a mode from mongoose
            var fixtureModel = conn.models[fixtureSchemaKey];

            var ctr = 0;
            // iterate over each document in the data fixture array, call a create and then propogate
            // rootCallback
            async.forEach(fixtureSet,
                // iterator function (dataDoc is the record, and callback propogates)
                function(dataDoc, returnLoaderCallback){
                    // use the loaded fixtureModel's mongoose static .create method
                    fixtureModel.create(dataDoc, function(err){
                        // handle err from mongoose
                        if(err){
                            console.log('Error Creating Fixture'.error);
                            console.log(err);
                            console.log('--');
                        } else {
                            // dump out a record id to notify what was created
                            // consoles for debugging
                            if (dataDoc._id === undefined){
                                //console.log('doc _id-> <_generatedMongoObjectID>');
                            } else {
                                //console.log('doc('+ctr+') _id->',dataDoc._id);
                            }
                            ctr++;
                        }

                        // *required* propogate our loader callback up the chain
                        returnLoaderCallback();

                    });

                },
                //returnLoaderCallback
                // fired when all the fixtures have been iterated and their callbacks returned or error
                function(err){
                    // will buble an error in any fixture, these are mandatory to fix/handle
                    if(err){ console.log('data loading error, check fixture -> <insert filename>');}
                    // display the insert counts
                    var msg = ''+fixtureDataKey+' loaded '+ctr+' fixtures';
                    console.log(msg);
                    rootCallback();
                }
            ); // end async-forEach
        }

        //
        // Operation: Update
        //
        if(operation === 'update'){
            var ctr = 0;
            // iterate over each document in the data fixture array, call a create and then propogate
            // rootCallback
            async.forEach(fixtureSet,
                // iterator function (dataDoc is the record, and callback propogates)
                function(dataDoc, returnLoaderCallback){
                    // use the loaded fixtureModel's mongoose static .create method
                    // update calls save using the [doc] passed in
                    dataDoc.save(function(err){
                        // handle err from mongoose
                        if(err){
                            console.log('Error Creating Fixture'.error);
                            console.log(err);
                            console.log('--');
                        } else {
                            // dump out a record id to notify what was created
                            // consoles for debugging
                            if (dataDoc._id === undefined){
                                //console.log('doc _id-> <_generatedMongoObjectID>');
                            } else {
                                //console.log('doc('+ctr+') _id->',dataDoc._id);
                            }
                            ctr++;
                        }

                        // *required* propogate our loader callback up the chain
                        returnLoaderCallback();

                    });

                },
                //returnLoaderCallback
                // fired when all the fixtures have been iterated and their callbacks returned or error
                function(err){
                    // will buble an error in any fixture, these are mandatory to fix/handle
                    if(err){ console.log('data loading error, check fixture -> <insert filename>');}
                    // display the insert counts
                    var msg = ''+fixtureDataKey+' updated '+ctr+' fixtures';
                    console.log(msg);
                    rootCallback();
                }
            ); // end async-forEach
        }

    }); //< end new functional wrapper for data-fixture loader
};


//  Adding a capitalize() method since mongoose will caps any registered model
//  even though it is defined as lowercase so when we check for it later we need
//  the correct casing
function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
