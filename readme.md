# Mongoose-Fixture

Inspired from Django's data-fixtures and Ruby's rake but built for nodejs.  Mongoose-Fixture is a command-line and utility library to load static json arrays/documents into mongodb.  Ideal for working with the [MEAN](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and) stack. 

## Why would I use it?

Installing Mongodb will give access to the ``mongoimport`` command, however that is for simple importing and not flexible as a workflow-tool. 

Mongoose-Fixture comes with the following features to improve developer workflow

* Project Configuration, organize documents collections into sets, for custom batch executions
* BoilerPlates, generate Schemas/Fixtures to reduce typing
* API can be used within other processes, a nodejs event-emitter


# Getting Started

## Installation

Recommend global install as this package contains a bin command that can be used globally accepting configuration files

    npm install -g mongoose-fixture

In order to get started with Mongoose-Fixture we first must create our config-file and then define our fixtures/schemas.

## Creating a ConfigFile

Mongoose-Fixture cmd usage requires the creation of a config-file for each project.  This config file specifies where and how to load fixtures/schemas as well as the boiler-plate generators.

First you must create this config file, ``cd`` to your projects local-root directory.

    // creates a file ``mongoose-fixture-config.js`` in your working directory
    mongoose-fixture --generateConfig

    // or you can define your own name
    mongoose-fixture --generateConfig='mf-config'

A generated config file will contain several environment variables such as mongodb connection strings, default directories for ``fixtures/`` and ``schemas``. And a single fixture-listing called ``all``.  You will need to customize these for your project. 

By default ``mongoose-fixture`` will look for a config file in the local directory called ``mongoose-fixture-config`` if you have different file name or wish to use ``mongoose-fixture`` with a different config you can specifiy the config in the cmd

    mongoose-fixture --configFile='/project/outDoorCamper/mf-config'

## Creating our Fixtures/Schemas

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

## Updating your Config with Fixture/Schema

Inside of your config file you will need to add you newly created schema/fixture pairs to a FixtureListing.

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


# New Development / Contribution

* more tests
* create a grunt hook, consider supporting own bin command?
* more documentation (specifically examples)


