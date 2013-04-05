# Mongoose-Fixture

A command-line interface and utility library to load documents into mongodb using mongoose schemas and static json arrays/documents.

Can't I import static json into mongo using 

    mongoimport --collection collectionName --file collection.json

Yes, that does work.  But what if you wanted to be able to import multiple files into multiple collections at once and be able to reset the data and arrange subsets of collections.  Even more what if you were testing a set of new features that needed you to programmatically reset or add new data from fixtures.  Mongoose-Fixture is here to help.

## Installation

Recommend global install as this package contains a bin command that can be used globally accepting configuration files

    npm install mongoose-fixture -g

## Command Line Interface

By default the mongoose-fixture cmd interface requires 3 params

* --configFile
* --fixture listing
* method [--add, --remove, --reset] to be defined.

    mongoose-fixture --configFile='/project/mongoose-fixture-config' --fixture='all' --add


## The Setup

Setting up mongoose-fixture for a project will entail 3 specific tasks

* Create Data Fixtures
* Create Corresponding Mongoose Schemas
* Create Configuration Fixture Listing


### Creating a set of data fixtures

A short example of an array of object-literals

    module.exports = [
        {
            _id:'open_camper_single', 
            name:'Open Camper Single', 
            tags:['camp','summer','tent','wilderness']
        },
        {
            _id:'red_oil_lantern',
            name:'Red Oil Lantern', 
            tags:['red','light source','oil lantern']
        }
    ];


### Creating a Schema File

A Schema file defined for the above data fixture

    module.exports = function(mongoose){
        
        var productSchema = mongoose.Schema({
            _id:{type:String},
            name:{type:String},
            tags:{type:Array},
            score:{type:Number}
        });

        return productSchema;
    };



### Create a Configuration Fixture Listing 

A json settings file to set your mongodb database and host/port settings and file-paths to the directories where data-fixtures exist and schemas

Assuming you are working on a project called 'Out Door Camper' and you are creating the config files at

    /projects/outDoorCamper/mongoose-fixture-config.js

The code below is a sample of ```mongoose-fixture-config.js```

    var basePath = '/projects/outDoorCamper';
    var dataFixturePath = basePath+'/data-fixtures/';
    var schemaPath = basePath+'/lib/schemas/';

    var fixtureListings = {};
    
    // Create a Listing of fixtures 
    fixtureListings['all'] = [
        {
            // general name used in output log
            itemName:'Product', 
            // should be the name of the schemas file (without the .js)
            schema:'ProductSchema', 
            // should be the name of the data-fixture file (without the .js)
            data:'ProductData',
            // put the file paths in
            schemaPath:schemaPath, 
            fixturePath:dataFixturePath,
            // should put the collection name in for removal process
            collection:'products'
        },
        {
            itemName:'Category', 
            schema:'CategorySchema', 
            data:'CategoryData',
            schemaPath:schemaPath, 
            fixturePath:dataFixturePath,
            collection:'categories'
        },
        {
            itemName:'StoreLocations',
            schema:'StoreLocationsSchema',
            data:'StoreLocationData', 
            schemaPath:schemaPath, 
            fixturePath:dataFixturePath, 
            collection:'storeLocations'
        }
    ];

    fixtureListings['stores'] = [
        // only a single fixture listed --> stores
        {
            itemName:'StoreLocations',
            schema:'StoreLocationsSchema',
            data:'StoreLocationData', 
            schemaPath:schemaPath, 
            fixturePath:dataFixturePath, 
            collection:'storeLocations'
        }
    ];


    // combine mongo connection and fixtureListings
    var fixtureConfig = {
        mongoConnection:{
            host:'localhost',
            port:'27017',
            dbname:'outdoorCamperStore'
        },
        fixtureListings:fixtureListings
    };

    // export the config
    module.exports = fixtureConfig;



## Putting it all together

Once you have configured all your data, schemas, and config time to fire up your fixture-loader.  By default the mongoose-fixture cmd interface expects the configFile, fixture listing, and a method [add,remove,reset] to be defined.

    // loads the defined configFile, the fixture all and just adds the documents
    mongoose-fixture --configFile='/project/outDoorCamper/mongoose-fixture-config' --fixture='all' --add

    // removes only the documents from the collections define in the fixture 'stores' in the config
    mongoose-fixture --configFile='/project/outDoorCamper/mongoose-fixture-config' --fixture='stores' --remove 

    // can run fixtures for an entire different project using a different command
    // using the reset would drop all the documents from the collections in fixture catalog and then reload them
    mongoose-fixture --configFile='/project/kioskCenter/mongoose-fixture-config' --fixture='catalog' --reset
