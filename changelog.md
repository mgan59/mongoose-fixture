# Mongoose-Fixture Changelog


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


