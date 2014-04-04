# Mongoose-Fixture Changelog

## Release 0.4.0

### Change Log

Update-Fixtures is to address issue #19 but includes other issues.

* Support for fixture updates by adding `update` as a flag in fixture callback and adding logic in `BaseFixtureLoader.js` to handle the operation.
  * Change required a fix for model loading dependency issue (#21).  `MongooseFixture.js` on init now loads all schemas/models in the mongoose-config schema path.
  * An example of update now exists in `test/fixtures/ProductUpdateMock.js` will update the examples on documentation site.
* Cleanup in Tests Commands
  * Fixed `mongoose.connection` to use `open` event listner
  * With adjusted mongoose connection the tests and cleanup needed wrapped into closure
  * Added test for update fixture
  * Adjustments to schema boilerplate generator, name is now placed into schema and `--suffix` flag to append file suffix names
  * some typo fixes
* Adjustments to `mongoose-fixture-config.js` simplified interface by removing what used to be a reference for the schema to load, but now that all schemas are loaded at runtime from the schema-path this is no longer necessary.  To make it easier I renamed the itemName which mapped the `conn.model`

## Release 0.3.2

Minor bug fixes with no api breaking changes.

 * Issue [#17](https://github.com/mgan59/mongoose-fixture/issues/17) sharing collections/models in fixture config
 * Issue [#18](https://github.com/mgan59/mongoose-fixture/issues/18) long standing `--reset` `--remove` exception propogation

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


