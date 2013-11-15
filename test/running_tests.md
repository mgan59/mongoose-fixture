# Overview of Tests

Tests are built using Isaac node-tap and are simple assertions

## Running Tests

### Run the mongodb test db
First run the mongod test db from the ``mongoose-fixture/tests`` directory
   
    # run the single mongod server
    mongod -f mongoose-fixture-single-conf

    # run the replica set servers
    mongod -f mongoose-fixture-replica-a-conf
    mongod -f mongoose-fixture-replica-b-conf
    mongod -f mongoose-fixture-replica-c-conf

Add the --fork if you want to run as a process, otherwise this will leave a mongo window open
I do this personally so I don't have yet another mongo instance in a background process

### Run the tests

The tap cli is linked to the npm package.json

    npm test

Or you can run the command which will execute all tests in the directory

    tap ./test

### Misc Notes

It is helpful to write tests and then use them for development of new features.  An example is the creation of the `--remove` error handler.  Wrote the test first then using the testing framework I'd run

   mongoose-fixture --configFile='mongoose-fixture-config-mock.js' --fixture='brokenRemove' --reset
