# Mongoose-Fixture

Inspired from Django's data-fixtures and Ruby's rake but built for nodejs.  Mongoose-Fixture is a command-line and utility library to load static json arrays/documents into mongodb.  Ideal for working with the [MEAN](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and) stack. 

## Why would I use it?

Installing Mongodb will give access to the ``mongoimport`` command, however that is for simple importing and not flexible as a workflow-tool. 

Mongoose-Fixture comes with the following features to improve developer workflow

* Project Configuration, organize documents collections into sets, for custom batch executions
* BoilerPlates, generate Schemas/Fixtures to reduce typing
* API can be used within other processes, a nodejs event-emitter

# Migrating to Release 0.3.0

There were api adjustments moving from version 0.2.x to 0.3.0, specifically within your data-fixtures.  In order to support the new 0.3.0 release you need to adjust the method signature in all your data fixtures.
    
    // 0.2.x data fixture method signature
    module.exports = function(mongoose, callback){ 
        // function body
    };

    // new 0.3.0 data fixture method signature
    module.exports = function(mongoose, conn, callback){
        // function body
    };

# Getting Started

Read the [documentation guide](http://mgan59.github.io/mongoose-fixture/) for a full-walkthrough and [sample project](https://github.com/mgan59/mongoose-fixture-example/)

# New Development / Contribution

* more tests
* create a grunt hook, consider supporting own bin command?
* more documentation (specifically examples)


