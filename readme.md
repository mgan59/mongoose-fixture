# Mongoose-Fixture

Inspired from Django's data-fixtures and Ruby's rake.  Mongoose-Fixture is a command-line interface and utility library to load documents from files into mongodb using mongoose schemas and static json arrays/documents.

Can't I import static json into mongo using 

    mongoimport --collection collectionName --file collection.json

Yes, that does work.  But over time that method can become complex to manage.  

Mongoose-Fixture provides more robust features such as:

* Project Configuration, organize collections into sets
* BoilerPlates, generate Schemas/Fixtures to reduce typing
* Programming Interface that can be run from within nodejs


## Installation

Recommend global install as this package contains a bin command that can be used globally accepting configuration files

    npm install mongoose-fixture -g

## Getting Started 

In order to get started with Mongoose-Fixture we first must create our config-file and then define our fixtures/schemas.

### Creating a ConfigFile

Mongoose-Fixture cmd usage requires the creation of a config-file for each project.  This config file specifies where and how to load fixtures/schemas as well as the boiler-plate generators.

First you must create this config file, ``cd`` to your projects local-root directory.

    mongoose-fixture --generateConfig

This will create a file in the local directory called ``mongoose-fixture-config.js`` with a few default directories set for ``fixtures/`` and ``schemas``.  Feel free to change these values to where you want your mongoose-fixtures.


By default ``mongoose-fixture`` will look for a config file in the local directory called ``mongoose-fixture-config`` if you have different file name or wish to use ``mongoose-fixture`` with a different config you can specifiy the config in the cmd

    mongoose-fixture --configFile='/project/outDoorCamper/mf-config'

### Creating our Fixtures/Schemas

Once we have created our config file for our project we can now begin creating our fixtures/schemas - assuming you are fine with the default config paths and have created the directories.

Once again we can generate boiler-plates for our schemas and fixtures

First we will create a Schema, lets pretend we are building an ecommerece store so we generate a schema for our ``Products``

    mongoose-fixture --generateSchema='ProductSchema'

This should create a file called ``ProductSchema.js`` in your ``schemas/`` project directory.

Then we should create our corresponding data-fixture

    mongoose-fixture --generateFixture='Products'

which will create a file ``products.js`` in the ``fixtures/`` directory.

From here you should first edit your ``ProductSchema.js`` and create the schema you want based on the [mongoose-documentation](http://mongoosejs.com/docs/guide.html).

Then you should edit your corresponding data-fixture to follow the defined schema.  Any field you add to your data-fixture objects that aren't part of the schema will be ignored when loaded into mongoDB.

### Updating your Config with Fixture/Schema

Inside of your config file you will need to add you newly created schema/fixture pair to a FixtureListing.

    // create our primary listing set
    var allFixtures = [{
        itemName:'Products', 
        schema:'ProductSchema',
        data:'Products',
        collection:'products'
    }];

You should now be all set to load your fixture data.


## Loading Fixtures into MongoDB

To interact with your fixtures/schemas you will need to use two parameter flags.

* --fixture listing
** defines which collection of fixtures you want the ``method`` to use
* method [--add, --remove, --reset] to be defined.
** reset first does --remove and then does --add behind the scenes


examples assume you have ``mongoose-fixture-config.js`` in local dir:

    //  loads fixture 'all' and just adds the documents
    mongoose-fixture --fixture='all' --add

    // removes only the documents from the collections define in the fixture 'stores' in the config
    mongoose-fixture --fixture='stores' --remove 

    // can run fixtures for an entire different project using a different command
    // using the reset would drop all the documents from the collections in fixture catalog and then reload them
    mongoose-fixture --fixture='catalog' --reset



