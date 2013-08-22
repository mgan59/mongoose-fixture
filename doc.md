# Getting Started with Mongoose-Fixture

## What is Mongoose-Fixture?

Mongoose-Fixture is a data management and workflow tool that enables developers to easily organize and import data into mongodb from both a CLI and nodejs API.

## Why should I use Mongoose-Fixture over mongoimport

Importing data with ``mongoimport`` is easy if you have a single json data file.  But if you have several json data files each with sub-document dependencies, validation, and simply organizing the data becomes difficult. Mongoose-Fixture is designed to solve these issues.

## Installation

First you need to install the Mongoose-Fixture global so you have access to the ``bin`` CLI.  

    npm install -g mongoose-fixture

Next when you create a project you will want to install mongoose-fixture locally as well.

    cd your_project/
	  npm init
    npm install mongoose-fixture --save

If you are wondering why you are installing mongoose-fixture twice you may want to read - [npm Global vs Local installation](http://blog.nodejs.org/2011/03/23/npm-1-0-global-vs-local-installation/)

## Configuring Mongoose-Fixture

I'll now walk you through configuring mongoose-fixture for an example project.  I've created a separate working repository with all the code samples.

### Generate a Mongoose-Fixture-Config

First step in using Mongoose-Fixture one must create a mongoose-config file similarly to grunt.  This config file sets up file-paths, mongodb authentication, and most importantly the fixture/schema organization listings.
    
    # from inside your project folder
    mongoose-fixture --generateConfig
    
    # you should see this output
    Generating Fixture-Config -> /your_project/mongoose-fixture-config.js


Now if you open your config file you will need to enter your mongodb server settings.  And you will see the default schema/fixture paths, you can change these if you want or keep the defaults.

    var fixtureConfig = FixtureConfig({
        mongoConnection:{
            'host':'localhost',
            'port':'27017',
            'dbname':''
        },
        paths:{
            schemaPath:__dirname+'/schemas/',
            dataFixturePath:__dirname+'/fixtures/'
        }
    });

Regardless if you keep or change the file paths you will need to create those folders (``schemas`` and ``fixtures``) in your local directory.

The remaining section of the config file is where you define the ``FixturePackages``.  The ``FixturePackages`` are how you organize json fixtures into packages so you can easily add/remove/reset groups of fixtures.  I'll delve further into packages later, but for now know that you define them here.  By default an 'all' package is provided so you can easily get started.

### Generate a Fixture/Schema

If you haven't yet created your directories do so now

    mkdir fixtures/
    mkdir schemas/

Now lets say we are doing an e-commerce app which needs products 

    # use our cli command to generate a fixture for products
    mongoose-fixture --generateFixture='Products'

    # output in cli showing the path used
    Generating DataFixture -> /your_project/fixtures/Products.js

    # use our cli to now create a schema
    mongoose-fixture --generateSchema='ProductSchema'

    # output in cli showing the path used
    Generating Schema -> /your_project/schemas/ProductSchema.js

Best place to start is to open the ``ProductSchema.js`` file and first define the schema for your product model.  You can view an example of the [completed version](https://github.com/mgan59/mongoose-fixture-example/blob/master/schemas/ProductSchema.js)

Next we should start adding our actual products to the fixture file so open the ``fixtures/Products.js``.  You can view an example of the [completed version](https://github.com/mgan59/mongoose-fixture-example/blob/master/fixtures/Products.js)

### Running the Fixture Import

Now that we have a fixture/schema we should update our config file by adding the set to our ``FixturePackages`` 'all'.  You can view the [completed version](https://github.com/mgan59/mongoose-fixture-example/blob/master/mongoose-fixture-config.js)

Finally, Time to run the fixture insert command **make sure your mongodb server is running**

    mongoose-fixture --fixture='all' --add

To verify that the data was inserted connect to the mongo server and check.

    mongo --port 27017

Output
    MongoDB shell version: 2.2.2
    connecting to: 127.0.0.1:27017/test
    
    > use fixture-test
    switched to db fixture-test
    > db.products.find().pretty()
    {
	    "name" : "Toy Box",
	    "price" : 9.99,
	    "qty" : 20,
	    "tags" : [
		      "toys",
		      "children",
		      "storage"
	    ],
	    "__v" : 0,
	    "_id" : ObjectId("5201b338bb5b194c5d000001")
    }
    {
	    "name" : "Baseball Bat",
	    "price" : 29.99,
	    "qty" : 6,
	    "tags" : [
		      "sporting",
		      "baseball",
		      "outdoors"
	    ],
	    "__v" : 0,
	    "_id" : ObjectId("5201b338bb5b194c5d000002")
    }


You could remove the data with a similar command

    mongoose-fixture --fixture='all' --remove

Or if you have the use case where you need to add and remove you can do it using the --reset 

    mongoose-fixture --fixture='all' --reset
