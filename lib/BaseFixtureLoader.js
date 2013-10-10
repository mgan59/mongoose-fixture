/*
 *  BaseFixtureLoader.js
 *
 *  Our base loader class that handles the abstraction for inserting the fixture
 *  @ fixtureConfig
 *  @ mongoose
 *  @ callback, to root level async-control-flow
 *
 */

var async = require('async');
var _ = require('lodash');

// rootCallback came from the mongoose-fixture top level async.seriesEach
// it must be executed on the loaders async completion to propogate back up the chain
module.exports = function(fixtureConfig, mongoose, rootCallback){
    //console.log('fired ', fixtureConfig);

    //unpack fixtureConfig
    var fixtureItem = fixtureConfig.itemName;
    var fixtureSchemaKey = fixtureConfig.schema;
    var fixtureDataKey = fixtureConfig.data;

    // need to pass our mongoose-db conn to the schema include so that it exports, will throw
    // an error if you dont have mongoose available
    var fixtureSchema = require(fixtureConfig.schemaPath+fixtureSchemaKey)(mongoose);

    // data-fixtures now accept a callback that must be returned
    // this callback allows one to add internal/additional async branches
    // within a fixture, specifically to load embeddable documents
    // hooks are available for a plugin system or future features
    var fixtureData = require(fixtureConfig.dataFixturePath+fixtureDataKey)(mongoose, function(err, globalFixtureData){
        var fixtureSet = null;

        // globalFixtureData can be an array as a convience
        // or it is a kwarg that contains a dataFixture namespace
        if(_.isArray(globalFixtureData) == true){
            fixtureSet = globalFixtureData;
        } else {
            fixtureSet = globalFixtureData.dataFixtures;
        }


        // make orm calls for each 'document' in the data-fixtiure
        // assumption is that data fixture will return an array of 'like' documents for the
        // given collection
        // and by collection that will be determind by the correspoding model/schema

        // time to move the schemas
        // make a schema for 'facilities', use set-option to use correct collection name
        // use model .create to staticically create each record
        // then have
        var fixtureModel = mongoose.model(fixtureItem, fixtureSchema);

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
                        console.log('Error Creating Fixture');
                        console.log(err.err);
                        console.log('--');
                    } else {
                        // dump out a record id to notify what was created
                        // consoles for debugging
                        if (dataDoc._id === undefined){
                            // console.log('doc _id-> <_generatedMongoObjectID>');
                        } else {
                            // console.log('doc _id->',dataDoc._id);
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
                console.log(''+fixtureDataKey+' loaded '+ctr+' fixtures');
                rootCallback();
            }
        ); // end async-forEach

    }); //< end new functional wrapper for data-fixture loader
};


