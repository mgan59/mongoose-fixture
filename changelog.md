# Mongoose-Fixture Changelog

## Release 0.3.1

Was decided that `conn` should also be passed into the schema for a given fixture.  This allows for the binding of the model and schema into the connection within the schema file.  This is done by certain projects and was implemented to facilitate those developers.

* `conn` now passed into a mongoose-schema
* Updated boiler templates
* Updated tests

## Release 0.3.0

The mongoose/mongo connection was adjusted to use `mongoose.createConnection` instead of a direct call to `mongoose.connect` this allows the usage of multiple mongo nodes.  These can be configured in the `mongoose-fixture-config.js`.  Backwards compatibility was maintained for single connections.  However, with the usage of `createConnect` a mongo-native db instance is created and needs to be passed around so that the bound models can be accessed.  Before the models could be fetched directly from the mongoose singleton but that is no longer supported.

 * `createConnection` now utilized
 * support for multiple hosts in `mongoose-fixture-config`
 * some more documentation
 * tests added for multiple nodes
 * test mongo conf files adjusted, now have replica support and multiple-mongo nodes


## Release 0.2.4

Last release for the 0.2.x line as 0.3.0 will have breaking changes in the data-fixture method signature

 * added better error messaging for the `--remove` operation for importing with cli

## Release 0.2.3

 * `--remove`` loader method now checks that collections exists and will throw exception and output to stdout works with --reset as well.
 ** added test for this feature.
 * added `colors` npm module from marak, color coded the tap tests.
 * upgraded to mongoose 3.6.20, required adjusts to the mongoose connection code. now uses events to start loader
 * added new test data fixture for large data sets, does not have a test `command.js` just a performance check
 ** maybe provided bench mark analysis
 * new data fixture interface to allow obj-literals to act as a data-map, and then reduced into an array. credit goes to [@hal-gh](https://github.com/hal-gh) for implementation
 * some documentation updates to boilerplates
 * mongo disconnect wrapper now called in last test

## Release 0.2.1

 * Made Schema/Fixture both now accept a callback and context as arguement(s).
 * Added Tests for CLI portion
 * Improved Documentation
 * github.io project page
 * Many other adjustments and fixes


